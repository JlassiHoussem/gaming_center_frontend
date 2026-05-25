import { Component, OnInit, OnDestroy, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule as NgFormsModule } from '@angular/forms';
import { CardComponent } from '../../shared/components/card.component';
import { BadgeComponent } from '../../shared/components/badge.component';
import { ButtonComponent } from '../../shared/components/button.component';
import { ModalComponent } from '../../shared/components/modal.component';
import { AppCurrencyPipe } from '../../shared/pipes/app-currency.pipe';
import { AppareilService } from '../../core/services/appareil.service';
import { FactureService, FactureItem } from '../../core/services/facture.service';
import { SettingsService } from '../../core/services/settings.service';
import { KPI, Appareil } from '../../shared/models/appareil.model';
import { Produit, OrderItem } from '../../shared/models/produit.model';

interface TrackedAppareil extends Appareil {
  localSessionStart?: Date;
  elapsed?: string;
  orderItems: OrderItem[];
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NgFormsModule, CardComponent, BadgeComponent, ButtonComponent, ModalComponent, AppCurrencyPipe],
  template: `
    <div class="page">
      <div class="hero-banner animate-fadeIn scan-overlay">
        <div class="hero-bg" style="background-image: url('gaming-hero.jpg')"></div>
        <div class="hero-content">
          <div class="hero-badge">SYSTÈME ACTIF</div>
          <h1 class="hero-title">GAMING <span class="gradient-text-red">CENTER</span></h1>
          <p class="hero-subtitle">GESTION DES SESSIONS • APPAREILS • BUFFET • RAPPORTS</p>
          <div class="hero-stats">
            <div class="hero-stat">
              <span class="hero-stat-value">{{ appareils.length }}</span>
              <span class="hero-stat-label">APPAREILS</span>
            </div>
            <div class="hero-stat">
              <span class="hero-stat-value">{{ localActiveCount }}</span>
              <span class="hero-stat-label">ACTIFS</span>
            </div>
            <div class="hero-stat">
              <span class="hero-stat-value">{{ getActivePercent() }}%</span>
              <span class="hero-stat-label">OCCUPATION</span>
            </div>
          </div>
        </div>
      </div>
      <div class="page-header animate-fadeIn">
        <div>
          <h2 class="page-title">Tableau de Bord</h2>
          <p class="page-subtitle">Vue d'ensemble de votre gaming center</p>
        </div>
        <div class="header-time">{{ currentTime | date:'HH:mm:ss' }}</div>
      </div>
      <div class="kpi-grid">
        <app-card class="kpi-card animate-slideUp delay-100" style="background-image: linear-gradient(135deg, rgba(11,14,19,0.9), rgba(11,14,19,0.6)), url('gaming-setup-1.jpg'); background-size: cover; background-position: center;">
          <div class="kpi-card-glow"></div>
          <div class="kpi-icon kpi-icon-red">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
          <div class="kpi-content">
            <span class="kpi-label">Revenus Totaux</span>
            <span class="kpi-value gradient-text">{{ kpi?.revenusTotaux | appCurrency }}</span>
            <span class="kpi-trend kpi-trend-up">+12.5% vs hier</span>
          </div>
        </app-card>
        <app-card class="kpi-card kpi-card-interactive animate-slideUp delay-200" (onClick)="toggleActiveFilter()" style="background-image: linear-gradient(135deg, rgba(11,14,19,0.9), rgba(11,14,19,0.6)), url('gaming-setup-2.jpg'); background-size: cover; background-position: center;">
          <div class="kpi-card-glow"></div>
          <div class="kpi-icon kpi-icon-cyan">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
          </div>
          <div class="kpi-content">
            <span class="kpi-label">Appareils Actifs</span>
            <span class="kpi-value text-cyan">{{ localActiveCount }}<span class="kpi-total">/{{ appareils.length }}</span></span>
            <span class="kpi-trend">{{ getActivePercent() }}% d'utilisation</span>
          </div>
        </app-card>
        <app-card class="kpi-card animate-slideUp delay-300" style="background-image: linear-gradient(135deg, rgba(11,14,19,0.9), rgba(11,14,19,0.6)), url('gaming-buffet.jpg'); background-size: cover; background-position: center;">
          <div class="kpi-card-glow"></div>
          <div class="kpi-icon kpi-icon-green">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8zM6 1v3M10 1v3M14 1v3"/></svg>
          </div>
          <div class="kpi-content">
            <span class="kpi-label">Ventes Buffet</span>
            <span class="kpi-value text-green">{{ kpi?.ventesBuffet | appCurrency }}</span>
            <span class="kpi-trend kpi-trend-up">+8.2% vs hier</span>
          </div>
        </app-card>
        <app-card class="kpi-card animate-slideUp delay-400" style="background-image: linear-gradient(135deg, rgba(11,14,19,0.9), rgba(11,14,19,0.6)), url('gaming-accessories.jpg'); background-size: cover; background-position: center;">
          <div class="kpi-card-glow"></div>
          <div class="kpi-icon kpi-icon-yellow">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
          </div>
          <div class="kpi-content">
            <span class="kpi-label">Bénéfice Net</span>
            <span class="kpi-value text-yellow">{{ kpi?.beneficeNet | appCurrency }}</span>
            <span class="kpi-trend kpi-trend-up">+15.3% vs hier</span>
          </div>
        </app-card>
      </div>
      <div class="section-header animate-fadeIn delay-300">
        <h3 class="section-title">
          Appareils en Temps Réel
          <span *ngIf="showActiveOnly" class="filter-badge">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg>
            Filtre: Actifs uniquement
            <button class="filter-clear" (click)="toggleActiveFilter()">✕</button>
          </span>
        </h3>
        <div class="section-actions">
          <app-button variant="secondary" (onClick)="refreshDevices()">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
            Actualiser
          </app-button>
        </div>
      </div>
      <div class="appareil-grid">
        <app-card *ngFor="let appareil of filteredAppareils; let i = index" class="appareil-card" [class.active-device]="appareil.statut === 'occupe'" [class]="'animate-slideUp delay-' + ((i + 1) * 75)">
          <div class="appareil-card-inner">
            <div class="appareil-header">
              <div class="appareil-title-section">
                <span class="appareil-name">{{ appareil.nom }}</span>
                <span class="appareil-type">{{ appareil.type }}</span>
              </div>
              <app-badge [label]="appareil.statut" [variant]="appareil.statut === 'libre' ? 'success' : appareil.statut === 'occupe' ? 'danger' : 'warning'"></app-badge>
            </div>
            <div class="appareil-rate">{{ appareil.tarifHoraire }}{{ currencySymbol }}/heure</div>
            <div *ngIf="appareil.elapsed" class="session-box">
              <div class="session-indicator"></div>
              <div class="session-info">
                <span class="session-label">Session en cours</span>
                <span class="session-time">{{ appareil.elapsed }}</span>
              </div>
            </div>
            <div *ngIf="appareil.orderItems.length > 0" class="orders-box">
              <div class="orders-header">
                <span class="orders-label">🍹 Commandes</span>
                <span class="orders-total">{{ getOrderTotal(appareil) | appCurrency }}</span>
              </div>
              <div class="orders-list">
                <div *ngFor="let item of appareil.orderItems" class="order-item">
                  <span class="order-item-name">{{ item.produit.name }}</span>
                  <span class="order-item-qty">×{{ item.quantity }}</span>
                  <span class="order-item-price">{{ item.produit.price * item.quantity | appCurrency }}</span>
                </div>
              </div>
            </div>
            <div class="appareil-actions">
              <app-button *ngIf="appareil.statut === 'libre'" variant="success" (onClick)="startSession(appareil)">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                Démarrer
              </app-button>
              <app-button *ngIf="appareil.statut === 'occupe'" variant="secondary" (onClick)="openBuffetModal(appareil)">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8zM6 1v3M10 1v3M14 1v3"/></svg>
                Buffet
              </app-button>
              <app-button *ngIf="appareil.statut === 'occupe'" variant="danger" (onClick)="stopSession(appareil)">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="1"/></svg>
                Arrêter
              </app-button>
            </div>
          </div>
        </app-card>
      </div>
    </div>

    <app-modal [isOpen]="showBuffetModal" [title]="'Buffet & Boissons - ' + (selectedAppareil?.nom || '')" (closed)="closeBuffetModal()">
      <div class="buffet-modal">
        <div *ngFor="let cat of buffetCategories" class="buffet-category">
          <h4 class="buffet-cat-title">{{ cat }}</h4>
          <div class="buffet-grid">
            <div *ngFor="let produit of getProduitsByCategory(cat)" class="buffet-item" [class.selected]="isItemSelected(produit)" (click)="toggleItem(produit)">
              <div class="buffet-item-info">
                <span class="buffet-item-name">{{ produit.name }}</span>
                <span class="buffet-item-price">{{ produit.price | appCurrency }}</span>
              </div>
              <div *ngIf="isItemSelected(produit)" class="buffet-item-qty">
                <button class="qty-btn" (click)="decrementItem(produit); $event.stopPropagation()">−</button>
                <span class="qty-value">{{ getItemQuantity(produit) }}</span>
                <button class="qty-btn" (click)="incrementItem(produit); $event.stopPropagation()">+</button>
              </div>
            </div>
          </div>
        </div>
        <div class="buffet-actions">
          <app-button variant="primary" (onClick)="openProductModal()">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
            Gérer Buffet
          </app-button>
          <app-button variant="secondary" (onClick)="closeBuffetModal()">Fermer</app-button>
        </div>
      </div>
    </app-modal>

    <app-modal [isOpen]="showProductModal" [title]="editingProduit ? 'Modifier Produit' : 'Ajouter Produit'" (closed)="closeProductModal()">
      <div class="product-modal">
        <div class="product-form">
          <div class="form-row">
            <input [(ngModel)]="productForm.name" class="form-input" placeholder="Nom du produit" />
            <select [(ngModel)]="productForm.category" class="form-input">
              <option value="">Catégorie</option>
              <option *ngFor="let cat of buffetCategories" [value]="cat">{{ cat }}</option>
              <option value="new">+ Nouvelle catégorie</option>
            </select>
            <input type="number" [(ngModel)]="productForm.price" class="form-input" [placeholder]="'Prix (' + currencySymbol + ')'" step="0.5" min="0" />
          </div>
          <div class="product-form-actions">
            <app-button variant="secondary" (onClick)="closeProductModal()">Annuler</app-button>
            <app-button variant="primary" [disabled]="!productForm.name || !productForm.category || productForm.price <= 0" (onClick)="saveProduit()">
              {{ editingProduit ? 'Modifier' : 'Ajouter' }}
            </app-button>
          </div>
        </div>
        <div class="product-list">
          <div *ngFor="let cat of buffetCategories" class="product-list-category">
            <h4 class="product-list-title">{{ cat }}</h4>
            <div *ngFor="let p of getProduitsByCategory(cat)" class="product-list-item">
              <span class="product-list-name">{{ p.name }}</span>
              <span class="product-list-price">{{ p.price | appCurrency }}</span>
              <div class="product-list-actions">
                <button class="product-edit-btn" (click)="editProduit(p)">✎</button>
                <button class="product-delete-btn" (click)="deleteProduit(p)">✕</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </app-modal>
  `,
  styles: [`
    .page { display: flex; flex-direction: column; gap: 28px; }

    .hero-banner {
      position: relative;
      border-radius: 16px;
      overflow: hidden;
      min-height: 200px;
      border: 1px solid rgba(255, 8, 8, 0.15);
    }
    .hero-bg {
      position: absolute;
      inset: 0;
      background-size: cover;
      background-position: center;
      filter: brightness(0.3) saturate(0.7);
    }
    .hero-content {
      position: relative;
      z-index: 1;
      padding: 32px 36px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 2px;
      color: #FF0808;
      background: rgba(255, 8, 8, 0.1);
      border: 1px solid rgba(255, 8, 8, 0.2);
      padding: 4px 12px;
      border-radius: 4px;
      width: fit-content;
    }
    .hero-title {
      font-size: 32px;
      font-weight: 800;
      color: #FFF;
      margin: 0;
      letter-spacing: 2px;
      text-transform: uppercase;
    }
    .hero-subtitle {
      font-size: 11px;
      color: #ABABAB;
      letter-spacing: 3px;
      margin: 0;
      text-transform: uppercase;
    }
    .hero-stats {
      display: flex;
      gap: 32px;
      margin-top: 8px;
    }
    .hero-stat {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .hero-stat-value {
      font-size: 22px;
      font-weight: 800;
      color: #FFF;
      font-family: 'Chakra Petch', sans-serif;
    }
    .hero-stat-label {
      font-size: 9px;
      color: #6b7280;
      letter-spacing: 1px;
      font-weight: 600;
    }

    .page-header { display: flex; align-items: flex-start; justify-content: space-between; }
    .page-title { font-size: 24px; font-weight: 800; margin: 0; letter-spacing: -0.5px; color: #FFF; }
    .page-subtitle { font-size: 12px; color: #6b7280; margin: 4px 0 0 0; }
    .header-time { font-size: 28px; font-weight: 300; color: #FF0808; font-family: 'SF Mono', 'Fira Code', monospace; letter-spacing: 2px; }
    .kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
    @media (max-width: 1280px) { .kpi-grid { grid-template-columns: repeat(2, 1fr); } }
    @media (max-width: 640px) { .kpi-grid { grid-template-columns: 1fr; } }
    .kpi-card {
      display: flex;
      gap: 16px;
      align-items: flex-start;
      padding: 20px;
      position: relative;
      overflow: hidden;
    }
    .kpi-card-glow {
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(255, 8, 8, 0.05), transparent 50%);
      pointer-events: none;
    }
    .kpi-card-interactive { cursor: pointer; transition: all 0.3s ease; }
    .kpi-card-interactive:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(255, 8, 8, 0.15); border-color: rgba(255, 8, 8, 0.3); }
    .kpi-card-interactive:active { transform: translateY(0); }
    .kpi-icon { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; position: relative; z-index: 1; }
    .kpi-icon svg { width: 20px; height: 20px; }
    .kpi-icon-red { background: linear-gradient(135deg, rgba(255, 8, 8, 0.2), rgba(122, 2, 2, 0.2)); color: #FF0808; border: 1px solid rgba(255, 8, 8, 0.2); }
    .kpi-icon-cyan { background: linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(59, 130, 246, 0.2)); color: #06B6D4; border: 1px solid rgba(6, 182, 212, 0.2); }
    .kpi-icon-green { background: linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(16, 185, 129, 0.2)); color: #4ade80; border: 1px solid rgba(34, 197, 94, 0.2); }
    .kpi-icon-yellow { background: linear-gradient(135deg, rgba(234, 179, 8, 0.2), rgba(245, 158, 11, 0.2)); color: #fbbf24; border: 1px solid rgba(234, 179, 8, 0.2); }
    .kpi-content { display: flex; flex-direction: column; gap: 4px; position: relative; z-index: 1; }
    .kpi-label { font-size: 11px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.8px; font-weight: 600; }
    .kpi-value { font-size: 26px; font-weight: 800; letter-spacing: -0.5px; }
    .kpi-total { font-size: 14px; color: #6b7280; font-weight: 400; }
    .kpi-trend { font-size: 10px; color: #6b7280; margin-top: 2px; }
    .kpi-trend-up { color: #4ade80; }
    .text-cyan { color: #06B6D4; } .text-green { color: #4ade80; } .text-yellow { color: #fbbf24; }
    .section-header { display: flex; align-items: center; justify-content: space-between; }
    .section-title { font-size: 16px; font-weight: 700; color: #FFF; margin: 0; display: flex; align-items: center; gap: 10px; }
    .filter-badge { display: inline-flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 500; color: #06B6D4; background: rgba(6, 182, 212, 0.1); border: 1px solid rgba(6, 182, 212, 0.2); border-radius: 20px; padding: 4px 10px; }
    .filter-badge svg { width: 8px; height: 8px; }
    .filter-clear { background: none; border: none; color: #06B6D4; cursor: pointer; font-size: 12px; padding: 0 2px; line-height: 1; opacity: 0.7; }
    .filter-clear:hover { opacity: 1; }
    .appareil-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
    @media (max-width: 1024px) { .appareil-grid { grid-template-columns: repeat(2, 1fr); } }
    @media (max-width: 640px) { .appareil-grid { grid-template-columns: 1fr; } }
    .appareil-card-inner { display: flex; flex-direction: column; gap: 10px; }
    .appareil-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; }
    .appareil-title-section { display: flex; flex-direction: column; gap: 2px; }
    .appareil-name { font-size: 14px; font-weight: 700; color: #FFF; }
    .appareil-type { font-size: 10px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; }
    .appareil-rate { font-size: 11px; color: #FF0808; font-weight: 600; }
    .session-box { background: rgba(6, 182, 212, 0.05); border: 1px solid rgba(6, 182, 212, 0.15); border-radius: 10px; padding: 10px 12px; display: flex; align-items: center; gap: 10px; }
    .session-indicator { width: 3px; height: 28px; border-radius: 2px; background: linear-gradient(to bottom, #06B6D4, #06B6D4); animation: pulse-glow 1.5s ease-in-out infinite; }
    .session-info { display: flex; flex-direction: column; gap: 2px; }
    .session-label { font-size: 9px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; }
    .session-time { font-size: 16px; font-weight: 700; color: #06B6D4; font-family: 'SF Mono', 'Fira Code', monospace; letter-spacing: 1px; }
    .orders-box { background: rgba(255, 8, 8, 0.05); border: 1px solid rgba(255, 8, 8, 0.15); border-radius: 10px; padding: 10px 12px; }
    .orders-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
    .orders-label { font-size: 10px; color: #FF0808; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
    .orders-total { font-size: 12px; font-weight: 700; color: #FF4444; }
    .orders-list { display: flex; flex-direction: column; gap: 3px; }
    .order-item { display: flex; justify-content: space-between; align-items: center; font-size: 10px; color: #94a3b8; }
    .order-item-name { flex: 1; }
    .order-item-qty { color: #06B6D4; font-weight: 600; margin: 0 6px; }
    .order-item-price { font-weight: 600; color: #FFF; }
    .appareil-actions { display: flex; gap: 6px; flex-wrap: wrap; }
    .appareil-card.active-device { border-color: rgba(255, 8, 8, 0.3); box-shadow: 0 0 20px rgba(255, 8, 8, 0.05); }
    .buffet-modal { display: flex; flex-direction: column; gap: 16px; max-height: 60vh; overflow-y: auto; padding-right: 8px; }
    .buffet-category { display: flex; flex-direction: column; gap: 8px; }
    .buffet-cat-title { font-size: 13px; font-weight: 700; color: #FF0808; margin: 0; text-transform: uppercase; letter-spacing: 0.5px; }
    .buffet-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; }
    .buffet-item { background: rgba(11, 14, 19, 0.7); border: 1px solid rgba(255, 8, 8, 0.15); border-radius: 8px; padding: 10px 12px; cursor: pointer; transition: all 0.2s; display: flex; flex-direction: column; gap: 6px; }
    .buffet-item:hover { border-color: rgba(255, 8, 8, 0.4); background: rgba(255, 8, 8, 0.1); }
    .buffet-item.selected { border-color: #06B6D4; background: rgba(6, 182, 212, 0.1); }
    .buffet-item-info { display: flex; flex-direction: column; gap: 2px; }
    .buffet-item-name { font-size: 12px; font-weight: 600; color: #FFF; }
    .buffet-item-price { font-size: 11px; color: #4ade80; font-weight: 600; }
    .buffet-item-qty { display: flex; align-items: center; gap: 8px; justify-content: center; margin-top: 4px; }
    .qty-btn { width: 24px; height: 24px; border-radius: 6px; border: 1px solid rgba(255, 8, 8, 0.3); background: rgba(255, 8, 8, 0.1); color: #FFF; font-size: 14px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; }
    .qty-btn:hover { background: rgba(255, 8, 8, 0.3); }
    .qty-value { font-size: 14px; font-weight: 700; color: #06B6D4; min-width: 20px; text-align: center; }
    .buffet-actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 8px; }
    .product-modal { display: flex; flex-direction: column; gap: 16px; }
    .product-form { display: flex; flex-direction: column; gap: 10px; }
    .form-row { display: flex; gap: 8px; }
    .form-row .form-input { flex: 1; background: linear-gradient(135deg, rgba(28, 29, 32, 0.9), rgba(11, 14, 19, 0.8)); border: 1px solid rgba(255, 8, 8, 0.15); border-radius: 8px; padding: 8px 10px; color: #FFF; font-size: 12px; outline: none; }
    .form-row .form-input:focus { border-color: #FF0808; box-shadow: 0 0 0 3px rgba(255, 8, 8, 0.1); }
    .form-row select.form-input { cursor: pointer; }
    .product-form-actions { display: flex; justify-content: flex-end; gap: 8px; }
    .product-list { max-height: 300px; overflow-y: auto; padding-right: 4px; }
    .product-list-category { margin-bottom: 12px; }
    .product-list-title { font-size: 11px; font-weight: 700; color: #FF0808; margin: 0 0 6px 0; text-transform: uppercase; letter-spacing: 0.5px; }
    .product-list-item { display: flex; align-items: center; gap: 8px; padding: 6px 8px; background: rgba(11, 14, 19, 0.4); border-radius: 6px; margin-bottom: 4px; }
    .product-list-name { flex: 1; font-size: 12px; color: #FFF; }
    .product-list-price { font-size: 11px; color: #4ade80; font-weight: 600; min-width: 50px; text-align: right; }
    .product-list-actions { display: flex; gap: 4px; }
    .product-edit-btn, .product-delete-btn { width: 22px; height: 22px; border-radius: 4px; border: none; cursor: pointer; font-size: 11px; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
    .product-edit-btn { background: rgba(255, 8, 8, 0.15); color: #FF4444; }
    .product-edit-btn:hover { background: rgba(255, 8, 8, 0.3); }
    .product-delete-btn { background: rgba(239, 68, 68, 0.15); color: #fca5a5; }
    .product-delete-btn:hover { background: rgba(239, 68, 68, 0.3); }
  `]
})
export class DashboardComponent implements OnInit, OnDestroy {
  kpi: KPI | null = null;
  appareils: TrackedAppareil[] = [];
  private timer: any;
  currentTime = new Date();

  produits: Produit[] = [];
  buffetCategories: string[] = [];
  currencySymbol = '€';
  showBuffetModal = false;
  selectedAppareil: TrackedAppareil | null = null;
  showActiveOnly = false;
  localActiveCount = 0;

  showProductModal = false;
  editingProduit: Produit | null = null;
  productForm = { name: '', category: '', price: 0 };

  private settingsService = inject(SettingsService);

  constructor(
    private appareilService: AppareilService,
    private factureService: FactureService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.buffetCategories = [...this.settingsService.current.categoriesBuffet];
    this.currencySymbol = this.settingsService.getCurrencySymbol();
    setTimeout(() => {
      this.appareilService.getKPIs().subscribe(kpi => this.kpi = kpi);
      this.loadProduits();
      this.loadDevices();
    });
    this.timer = setInterval(() => {
      this.tick();
    }, 1000);
  }

  ngOnDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  loadProduits() {
    this.appareilService.getProduits().subscribe({
      next: (produits) => {
        this.produits = produits;
        const fromProducts = new Set(produits.map(p => p.category));
        const fromSettings = this.settingsService.current.categoriesBuffet;
        this.buffetCategories = [...new Set([...fromSettings, ...fromProducts])];
        this.cdr.detectChanges();
      }
    });
  }

  tick() {
    this.currentTime = new Date();
    this.localActiveCount = this.appareils.filter(a => a.statut === 'occupe').length;
    this.appareils.forEach(a => {
      if (a.localSessionStart) {
        a.elapsed = this.computeElapsed(a.localSessionStart);
      }
    });
    this.cdr.detectChanges();
  }

  loadDevices() {
    this.appareilService.getAppareils().subscribe(apiAppareils => {
      this.appareils = apiAppareils.map(apiApp => {
        const existing = this.appareils.find(a => a.id === apiApp.id);
        const tracked: TrackedAppareil = { ...apiApp, orderItems: existing?.orderItems || [] };

        if (apiApp.statut === 'occupe') {
          if (existing?.localSessionStart) {
            tracked.localSessionStart = existing.localSessionStart;
            tracked.elapsed = existing.elapsed;
          } else if (apiApp.sessionStart) {
            tracked.localSessionStart = apiApp.sessionStart;
            tracked.elapsed = this.computeElapsed(apiApp.sessionStart);
          } else {
            tracked.localSessionStart = new Date();
            tracked.elapsed = '00:00:00';
          }
        } else {
          tracked.localSessionStart = undefined;
          tracked.elapsed = undefined;
        }

        return tracked;
      });
      this.localActiveCount = this.appareils.filter(a => a.statut === 'occupe').length;
      this.cdr.detectChanges();
    });
  }

  getActivePercent(): number {
    const total = this.appareils.length || 8;
    return Math.round((this.localActiveCount / total) * 100);
  }

  get filteredAppareils(): TrackedAppareil[] {
    if (this.showActiveOnly) {
      return this.appareils.filter(a => a.statut === 'occupe');
    }
    return this.appareils;
  }

  toggleActiveFilter() {
    this.showActiveOnly = !this.showActiveOnly;
    this.cdr.detectChanges();
  }

  refreshDevices() {
    this.loadDevices();
  }

  computeElapsed(sessionStart: Date): string {
    const elapsed = Date.now() - sessionStart.getTime();
    if (elapsed < 0) return '00:00:00';
    const hours = Math.floor(elapsed / 3600000);
    const minutes = Math.floor((elapsed % 3600000) / 60000);
    const seconds = Math.floor((elapsed % 60000) / 1000);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  getProduitsByCategory(category: string): Produit[] {
    return this.produits.filter(p => p.category === category);
  }

  isItemSelected(produit: Produit): boolean {
    if (!this.selectedAppareil) return false;
    return this.selectedAppareil.orderItems.some(i => i.produit.id === produit.id);
  }

  getItemQuantity(produit: Produit): number {
    if (!this.selectedAppareil) return 0;
    const item = this.selectedAppareil.orderItems.find(i => i.produit.id === produit.id);
    return item ? item.quantity : 0;
  }

  toggleItem(produit: Produit) {
    if (!this.selectedAppareil) return;
    const existing = this.selectedAppareil.orderItems.find(i => i.produit.id === produit.id);
    if (existing) {
      existing.quantity++;
    } else {
      this.selectedAppareil.orderItems.push({ produit, quantity: 1 });
    }
    this.cdr.detectChanges();
  }

  incrementItem(produit: Produit) {
    if (!this.selectedAppareil) return;
    const item = this.selectedAppareil.orderItems.find(i => i.produit.id === produit.id);
    if (item) item.quantity++;
    this.cdr.detectChanges();
  }

  decrementItem(produit: Produit) {
    if (!this.selectedAppareil) return;
    const idx = this.selectedAppareil.orderItems.findIndex(i => i.produit.id === produit.id);
    if (idx >= 0) {
      if (this.selectedAppareil.orderItems[idx].quantity > 1) {
        this.selectedAppareil.orderItems[idx].quantity--;
      } else {
        this.selectedAppareil.orderItems.splice(idx, 1);
      }
    }
    this.cdr.detectChanges();
  }

  getOrderTotal(appareil: TrackedAppareil): number {
    return appareil.orderItems.reduce((sum, item) => sum + item.produit.price * item.quantity, 0);
  }

  openBuffetModal(appareil: TrackedAppareil) {
    this.selectedAppareil = appareil;
    this.showBuffetModal = true;
  }

  closeBuffetModal() {
    this.showBuffetModal = false;
    this.selectedAppareil = null;
  }

  openProductModal() {
    this.showProductModal = true;
    this.editingProduit = null;
    this.productForm = { name: '', category: '', price: 0 };
  }

  closeProductModal() {
    this.showProductModal = false;
    this.editingProduit = null;
    this.productForm = { name: '', category: '', price: 0 };
  }

  editProduit(produit: Produit) {
    this.editingProduit = produit;
    this.productForm = { name: produit.name, category: produit.category, price: produit.price };
  }

  saveProduit() {
    if (!this.productForm.name || !this.productForm.category || this.productForm.price <= 0) return;

    if (this.productForm.category === 'new') {
      const newCat = prompt('Nom de la nouvelle catégorie:');
      if (!newCat) return;
      this.productForm.category = newCat;
    }

    if (this.editingProduit) {
      this.appareilService.updateProduit(this.editingProduit.id, this.productForm).subscribe({
        next: (updated) => {
          this.produits = this.produits.map(p => p.id === updated.id ? updated : p);
          this.mergeCategories();
          this.productForm = { name: '', category: '', price: 0 };
          this.editingProduit = null;
          this.cdr.detectChanges();
        },
        error: (err) => alert('Erreur: ' + (err.error?.message || err.message))
      });
    } else {
      this.appareilService.addProduit(this.productForm).subscribe({
        next: (nouveau) => {
          this.produits = [...this.produits, nouveau];
          this.mergeCategories();
          this.productForm = { name: '', category: '', price: 0 };
          this.cdr.detectChanges();
        },
        error: (err) => alert('Erreur: ' + (err.error?.message || err.message))
      });
    }
  }

  deleteProduit(produit: Produit) {
    if (confirm(`Supprimer "${produit.name}" ?`)) {
      this.appareilService.deleteProduit(produit.id).subscribe({
        next: () => {
          this.produits = this.produits.filter(p => p.id !== produit.id);
          this.mergeCategories();
          this.cdr.detectChanges();
        },
        error: (err) => alert('Erreur: ' + (err.error?.message || err.message))
      });
    }
  }

  private mergeCategories() {
    const fromProducts = new Set(this.produits.map(p => p.category));
    const fromSettings = this.settingsService.current.categoriesBuffet;
    this.buffetCategories = [...new Set([...fromSettings, ...fromProducts])];
  }

  startSession(appareil: TrackedAppareil) {
    this.appareilService.startSession(appareil.id).subscribe(() => {
      const tracked = this.appareils.find(a => a.id === appareil.id);
      if (tracked) {
        tracked.statut = 'occupe';
        tracked.localSessionStart = new Date();
        tracked.elapsed = '00:00:00';
        tracked.orderItems = [];
        this.localActiveCount = this.appareils.filter(a => a.statut === 'occupe').length;
        this.cdr.detectChanges();
      }
    });
  }

  stopSession(appareil: TrackedAppareil) {
    this.appareilService.stopSession(appareil.id).subscribe({
      next: (result) => {
        const startTime = appareil.localSessionStart || new Date();
        const endTime = new Date();
        const duration = result.durationHours || (Date.now() - startTime.getTime()) / 3600000;
        const sessionAmount = duration * appareil.tarifHoraire;

        const factureItems: FactureItem[] = appareil.orderItems.map(item => ({
          name: item.produit.name,
          quantity: item.quantity,
          price: item.produit.price
        }));

        const itemsTotal = appareil.orderItems.reduce((sum, item) => sum + item.produit.price * item.quantity, 0);
        const totalAmount = sessionAmount + itemsTotal;

        this.factureService.generateFacture({
          sessionId: result.id || 0,
          deviceName: appareil.nom,
          deviceType: appareil.type,
          startTime: startTime.toLocaleTimeString('fr-FR'),
          endTime: endTime.toLocaleTimeString('fr-FR'),
          duration: duration,
          hourlyRate: appareil.tarifHoraire,
          sessionAmount: Math.round(sessionAmount * 100) / 100,
          items: factureItems,
          itemsTotal: Math.round(itemsTotal * 100) / 100,
          totalAmount: Math.round(totalAmount * 100) / 100
        });

        if (appareil.orderItems.length > 0) {
          const order = {
            items: appareil.orderItems.map(item => ({
              productId: item.produit.id,
              quantity: item.quantity,
              unitPrice: item.produit.price
            })),
            sessionId: result.id,
            total: itemsTotal
          };
          this.appareilService.createOrder(order).subscribe();
        }

        this.forceStopDevice(appareil);
      },
      error: () => {
        this.forceStopDevice(appareil);
      }
    });
  }

  private forceStopDevice(appareil: TrackedAppareil) {
    const tracked = this.appareils.find(a => a.id === appareil.id);
    if (tracked) {
      tracked.statut = 'libre';
      tracked.localSessionStart = undefined;
      tracked.elapsed = undefined;
      tracked.orderItems = [];
      this.localActiveCount = this.appareils.filter(a => a.statut === 'occupe').length;
      this.cdr.detectChanges();
    }
  }
}
