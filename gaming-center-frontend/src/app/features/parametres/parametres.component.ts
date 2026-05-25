import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardComponent } from '../../shared/components/card.component';
import { ButtonComponent } from '../../shared/components/button.component';
import { Parametres } from '../../shared/models/rapport.model';
import { loadSettings, saveSettings } from '../../core/services/settings.service';

const DEFAULTS: Parametres = {
  nomEtablissement: 'Gaming Center Pro',
  devise: 'EUR',
  fuseauHoraire: 'Europe/Paris',
  typesAppareils: ['PC', 'PS4', 'PS5', 'Xbox', 'Simulateur'],
  categoriesBuffet: ['Boissons', 'Snacks', 'Repas']
};

@Component({
  selector: 'app-parametres',
  standalone: true,
  imports: [CommonModule, FormsModule, CardComponent, ButtonComponent],
  template: `
    <div class="page">
      <div class="hero-banner animate-fadeIn scan-overlay">
        <div class="hero-bg" style="background-image: url('gaming-accessories.jpg')"></div>
        <div class="hero-content">
          <div class="hero-badge">CONFIGURATION</div>
          <h1 class="hero-title">Paramètres & <span class="gradient-text-red">Configuration</span></h1>
          <p class="hero-subtitle">Configuration de votre gaming center</p>
        </div>
      </div>
      <div class="page-header animate-fadeIn">
        <div>
          <h2 class="page-title">Paramètres</h2>
          <p class="page-subtitle">Configuration de votre gaming center</p>
        </div>
      </div>
      <div class="settings-grid animate-slideUp delay-100">
        <app-card class="settings-card">
          <h3 class="settings-title">Informations générales</h3>
          <div class="settings-form">
            <div class="form-group"><label class="form-label">Nom de l'établissement</label><input [(ngModel)]="settings.nomEtablissement" class="form-input" placeholder="Gaming Center Pro"></div>
            <div class="form-group"><label class="form-label">Devise</label><select [(ngModel)]="settings.devise" class="form-input"><option value="EUR">EUR (€)</option><option value="USD">USD ($)</option><option value="MAD">MAD (DH)</option><option value="EGP">EGP (£)</option><option value="TDN">TDN (DT)</option></select></div>
            <div class="form-group"><label class="form-label">Fuseau horaire</label><select [(ngModel)]="settings.fuseauHoraire" class="form-input"><option value="Europe/Paris">Europe/Paris (UTC+1)</option><option value="Africa/Casablanca">Africa/Casablanca (UTC+1)</option><option value="Africa/Cairo">Africa/Cairo (UTC+2)</option></select></div>
            <div class="form-actions">
              <app-button variant="primary" (onClick)="save()">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17,21 17,13 7,13 7,21"/><polyline points="7,3 7,8 15,8"/></svg>
                Sauvegarder
              </app-button>
            </div>
          </div>
        </app-card>
        <app-card class="settings-card">
          <h3 class="settings-title">Types d'appareils</h3>
          <div class="tags-list">
            <span *ngFor="let type of settings.typesAppareils" class="tag">
              {{ type }}
              <button class="tag-remove" (click)="removeType(type)">×</button>
            </span>
          </div>
          <div class="add-tag-form">
            <input [(ngModel)]="newType" class="form-input" placeholder="Nouveau type..." (keyup.enter)="addType()">
            <app-button variant="secondary" (onClick)="addType()" [disabled]="!newType">+</app-button>
          </div>
        </app-card>
        <app-card class="settings-card">
          <h3 class="settings-title">Catégories Buffet</h3>
          <div class="tags-list">
            <span *ngFor="let cat of settings.categoriesBuffet" class="tag tag-cyan">
              {{ cat }}
              <button class="tag-remove" (click)="removeCategory(cat)">×</button>
            </span>
          </div>
          <div class="add-tag-form">
            <input [(ngModel)]="newCategory" class="form-input" placeholder="Nouvelle catégorie..." (keyup.enter)="addCategory()">
            <app-button variant="secondary" (onClick)="addCategory()" [disabled]="!newCategory">+</app-button>
          </div>
        </app-card>
      </div>
    </div>
  `,
  styles: [`
    .page { display: flex; flex-direction: column; gap: 24px; }
    .page-header { display: flex; align-items: flex-start; justify-content: space-between; }
    .page-title { font-size: 24px; font-weight: 800; margin: 0; letter-spacing: -0.5px; color: #FFF; }
    .page-subtitle { font-size: 12px; color: #6b7280; margin: 4px 0 0 0; }

    .hero-banner {
      position: relative;
      border-radius: 16px;
      overflow: hidden;
      min-height: 140px;
      border: 1px solid rgba(255, 8, 8, 0.15);
    }
    .hero-bg {
      position: absolute;
      inset: 0;
      background-size: cover;
      background-position: center;
      filter: brightness(0.25) saturate(0.7);
    }
    .hero-content {
      position: relative;
      z-index: 1;
      padding: 24px 32px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .hero-badge {
      display: inline-flex;
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
      font-size: 28px;
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
    .settings-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
    @media (max-width: 768px) { .settings-grid { grid-template-columns: 1fr; } }
    .settings-card { padding: 20px; }
    .settings-title { font-size: 14px; font-weight: 700; color: #FFF; margin: 0 0 18px 0; padding-bottom: 12px; border-bottom: 1px solid rgba(255, 8, 8, 0.1); }
    .settings-form { display: flex; flex-direction: column; gap: 14px; }
    .form-group { display: flex; flex-direction: column; gap: 6px; }
    .form-label { font-size: 11px; color: #6b7280; font-weight: 500; }
    .form-input { background: linear-gradient(135deg, rgba(28, 29, 32, 0.9), rgba(11, 14, 19, 0.8)); border: 1px solid rgba(255, 8, 8, 0.15); border-radius: 8px; padding: 10px 12px; color: #FFF; font-size: 13px; outline: none; transition: all 0.25s; }
    .form-input:focus { border-color: #FF0808; box-shadow: 0 0 0 3px rgba(255, 8, 8, 0.1); }
    .form-actions { display: flex; justify-content: flex-end; margin-top: 4px; }
    .tags-list { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 14px; }
    .tag { display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 500; background: rgba(255, 8, 8, 0.1); border: 1px solid rgba(255, 8, 8, 0.2); color: #FF4444; }
    .tag-cyan { background: rgba(6, 182, 212, 0.1); border-color: rgba(6, 182, 212, 0.2); color: #22d3ee; }
    .tag-remove { background: none; border: none; color: inherit; cursor: pointer; font-size: 16px; padding: 0; line-height: 1; opacity: 0.6; transition: opacity 0.2s; }
    .tag-remove:hover { opacity: 1; }
    .add-tag-form { display: flex; gap: 8px; }
    .add-tag-form .form-input { flex: 1; }
  `]
})
export class ParametresComponent implements OnInit {
  settings: Parametres = { ...DEFAULTS };
  newType = '';
  newCategory = '';

  constructor() {}

  ngOnInit() {
    const saved = loadSettings();
    if (saved) this.settings = saved;
  }

  save() {
    saveSettings(this.settings);
    alert('Paramètres sauvegardés! ✓');
  }

  addType() { if (this.newType.trim() && !this.settings.typesAppareils.includes(this.newType.trim())) { this.settings.typesAppareils.push(this.newType.trim()); this.newType = ''; this.save(); } }
  removeType(type: string) { this.settings.typesAppareils = this.settings.typesAppareils.filter(t => t !== type); this.save(); }
  addCategory() { if (this.newCategory.trim() && !this.settings.categoriesBuffet.includes(this.newCategory.trim())) { this.settings.categoriesBuffet.push(this.newCategory.trim()); this.newCategory = ''; this.save(); } }
  removeCategory(cat: string) { this.settings.categoriesBuffet = this.settings.categoriesBuffet.filter(c => c !== cat); this.save(); }
}
