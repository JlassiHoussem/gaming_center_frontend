import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { ButtonComponent } from '../../shared/components/button.component';
import { ModalComponent } from '../../shared/components/modal.component';
import { AppCurrencyPipe } from '../../shared/pipes/app-currency.pipe';
import { BuffetService } from '../../core/services/buffet.service';
import { SettingsService } from '../../core/services/settings.service';
import { Produit, PanierItem } from '../../shared/models/buffet.model';

@Component({
  selector: 'app-buffet',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent, ModalComponent, AppCurrencyPipe],
  template: `
    <div class="page">
      <div class="hero-banner animate-fadeIn scan-overlay">
        <div class="hero-bg" style="background-image: url('gaming-buffet.jpg')"></div>
        <div class="hero-content">
          <div class="hero-badge">BUFFET & BOISSONS</div>
          <h1 class="hero-title">Buffet <span class="gradient-text-red">Gaming</span></h1>
          <p class="hero-subtitle">Gestion des ventes et du catalogue</p>
        </div>
      </div>
      <div class="page-header animate-fadeIn">
        <div>
          <h2 class="page-title">Buffet</h2>
          <p class="page-subtitle">Gestion des ventes et du catalogue</p>
        </div>
        <app-button variant="primary" (onClick)="openCatalogModal()">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
          Gérer Catalogue
        </app-button>
      </div>
      <div class="filter-bar animate-fadeIn delay-100">
        <button class="filter-btn" [class.active]="categorieFilter === 'all'" (click)="categorieFilter = 'all'">
          <span class="filter-dot dot-all"></span>Tous
        </button>
        <button *ngFor="let cat of categories" class="filter-btn" [class.active]="categorieFilter === cat" (click)="categorieFilter = cat">
          <span class="filter-dot dot-cat"></span>{{ cat }}
        </button>
      </div>
      <div class="buffet-layout">
        <div class="catalog-section animate-fadeIn delay-200">
          <div class="produit-grid">
            <div *ngFor="let produit of filteredProduits; let i = index" class="produit-card-wrapper" [class]="'animate-slideUp delay-' + (i * 50)" (click)="addToPanier(produit)">
              <div class="produit-card">
                <div class="produit-image">
                  <span class="produit-emoji">{{ getEmoji(produit.categorie) }}</span>
                  <div class="produit-overlay">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
                  </div>
                </div>
                <div class="produit-info">
                  <span class="produit-name">{{ produit.nom }}</span>
                  <div class="produit-bottom">
                    <span class="produit-price">{{ produit.prix | appCurrency }}</span>
                    <span class="produit-cat">{{ produit.categorie }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="cart-section animate-slideIn delay-300">
          <div class="cart-card">
            <div class="cart-header">
              <h3 class="cart-title">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>
                Panier
              </h3>
              <span *ngIf="panier.length > 0" class="cart-badge">{{ getCartCount() }}</span>
            </div>
            <div *ngIf="panier.length === 0" class="cart-empty">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>
              <p>Votre panier est vide</p>
            </div>
            <div *ngFor="let item of panier" class="cart-item">
              <div class="cart-item-info">
                <span class="cart-item-name">{{ item.produit.nom }}</span>
                <span class="cart-item-price">{{ item.produit.prix | appCurrency }}</span>
              </div>
              <div class="cart-item-actions">
                <button class="qty-btn" (click)="removeFromPanier(item.produit.id)">−</button>
                <span class="qty-value">{{ item.quantite }}</span>
                <button class="qty-btn qty-add" (click)="addToPanier(item.produit)">+</button>
              </div>
            </div>
            <div *ngIf="panier.length > 0" class="cart-footer">
              <div class="cart-total">
                <span class="total-label">Total</span>
                <span class="total-value">{{ panierTotal | appCurrency }}</span>
              </div>
              <app-button variant="success" (onClick)="encaisser()" [disabled]="panier.length === 0" class="checkout-btn">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                Encaisser
              </app-button>
            </div>
          </div>
        </div>
      </div>
      <app-modal [isOpen]="showEncaissementModal" title="Encaissement" (closed)="closeEncaissementModal()">
        <div class="checkout-modal">
          <div class="checkout-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#4ade80" stroke-width="1.5"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
          <p class="checkout-total">Total: <span class="text-purple">{{ encaissementTotal | appCurrency }}</span></p>
          <p class="checkout-success">Commande enregistrée avec succès!</p>
          <div class="form-actions"><app-button variant="primary" (onClick)="closeEncaissementModal()">Terminé</app-button></div>
        </div>
      </app-modal>
      <app-modal [isOpen]="showCatalogModal" [title]="editingProduit ? 'Modifier Produit' : 'Ajouter Produit'" (closed)="closeCatalogModal()">
        <div class="catalog-modal">
          <div class="catalog-form">
            <div class="form-row">
              <input [(ngModel)]="productForm.nom" class="form-input" placeholder="Nom du produit" />
              <select [(ngModel)]="productForm.categorie" class="form-input">
                <option value="">Catégorie</option>
                <option *ngFor="let cat of categories" [value]="cat">{{ cat }}</option>
                <option value="new">+ Nouvelle catégorie</option>
              </select>
              <input type="number" [(ngModel)]="productForm.prix" class="form-input" [placeholder]="'Prix (' + currencySymbol + ')'" step="0.5" min="0" />
            </div>
            <div class="form-actions-row">
              <app-button variant="secondary" (onClick)="closeCatalogModal()">Annuler</app-button>
              <app-button variant="primary" [disabled]="!productForm.nom || !productForm.categorie || productForm.prix <= 0" (onClick)="saveProduit()">
                {{ editingProduit ? 'Modifier' : 'Ajouter' }}
              </app-button>
            </div>
          </div>
          <div class="catalog-list">
            <div *ngFor="let cat of categories" class="catalog-list-cat">
              <h4 class="catalog-list-title">{{ cat }}</h4>
              <div *ngFor="let p of getProduitsByCat(cat)" class="catalog-list-item">
                <span class="catalog-list-name">{{ p.nom }}</span>
                <span class="catalog-list-price">{{ p.prix | appCurrency }}</span>
                <div class="catalog-list-actions">
                  <button class="cat-edit-btn" (click)="editProduit(p)">✎</button>
                  <button class="cat-delete-btn" (click)="deleteProduit(p)">✕</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </app-modal>
    </div>
  `,
  styles: [`
    .page { display: flex; flex-direction: column; gap: 24px; }

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

    .page { display: flex; flex-direction: column; gap: 24px; }
    .page-header { display: flex; align-items: flex-start; justify-content: space-between; }
    .page-title { font-size: 24px; font-weight: 800; margin: 0; letter-spacing: -0.5px; color: #FFF; }
    .page-subtitle { font-size: 12px; color: #6b7280; margin: 4px 0 0 0; }
    .filter-bar { display: flex; gap: 8px; flex-wrap: wrap; }
    .filter-btn { display: inline-flex; align-items: center; gap: 8px; padding: 8px 14px; border-radius: 8px; font-size: 12px; font-weight: 500; background: rgba(11, 14, 19, 0.5); border: 1px solid rgba(255, 8, 8, 0.1); color: #ABABAB; cursor: pointer; transition: all 0.25s; }
    .filter-btn:hover { background: rgba(11, 14, 19, 0.7); color: #FFF; }
    .filter-btn.active { background: rgba(255, 8, 8, 0.15); border-color: rgba(255, 8, 8, 0.3); color: #FFF; }
    .filter-dot { width: 6px; height: 6px; border-radius: 50%; }
    .filter-dot.dot-all { background: #FF0808; } .filter-dot.dot-cat { background: #06B6D4; }
    .buffet-layout { display: flex; gap: 24px; }
    .catalog-section { flex: 1; }
    .cart-section { width: 300px; flex-shrink: 0; }
    .produit-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
    @media (max-width: 1024px) { .produit-grid { grid-template-columns: repeat(2, 1fr); } }
    .produit-card { background: rgba(5, 2, 8, 0.9); backdrop-filter: blur(16px); border: 1px solid rgba(255, 8, 8, 0.15); border-radius: 14px; overflow: hidden; cursor: pointer; transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1); position: relative; }
    .produit-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent, rgba(255, 8, 8, 0.3), transparent); pointer-events: none; }
    .produit-card:hover { transform: translateY(-4px); border-color: rgba(255, 8, 8, 0.3); box-shadow: 0 8px 32px rgba(255, 8, 8, 0.15); }
    .produit-card:hover .produit-overlay { opacity: 1; }
    .produit-image { height: 80px; background: linear-gradient(135deg, rgba(255, 8, 8, 0.05), rgba(122, 2, 2, 0.05)); display: flex; align-items: center; justify-content: center; position: relative; }
    .produit-emoji { font-size: 32px; }
    .produit-overlay { position: absolute; inset: 0; background: rgba(255, 8, 8, 0.3); display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.25s; color: #fff; }
    .produit-info { padding: 12px 14px; }
    .produit-name { font-size: 13px; font-weight: 600; color: #FFF; display: block; margin-bottom: 6px; }
    .produit-bottom { display: flex; align-items: center; justify-content: space-between; }
    .produit-price { font-size: 15px; font-weight: 700; color: #FF0808; }
    .produit-cat { font-size: 10px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; }
    .cart-card { background: rgba(5, 2, 8, 0.9); backdrop-filter: blur(20px); border: 1px solid rgba(255, 8, 8, 0.15); border-radius: 16px; padding: 18px; position: sticky; top: 28px; display: flex; flex-direction: column; gap: 16px; position: relative; }
    .cart-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent, rgba(255, 8, 8, 0.3), transparent); pointer-events: none; }
    .cart-header { display: flex; align-items: center; gap: 8px; }
    .cart-title { font-size: 14px; font-weight: 700; color: #FFF; margin: 0; display: flex; align-items: center; gap: 8px; }
    .cart-badge { background: linear-gradient(135deg, #FF0808, #7A0202); color: #fff; font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 10px; }
    .cart-empty { display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 24px 0; color: #6b7280; }
    .cart-empty svg { color: #4b5563; }
    .cart-empty p { font-size: 12px; margin: 0; }
    .cart-item { display: flex; align-items: center; justify-content: space-between; background: rgba(11, 14, 19, 0.4); border-radius: 10px; padding: 10px 12px; }
    .cart-item-info { display: flex; flex-direction: column; gap: 2px; }
    .cart-item-name { font-size: 12px; color: #FFF; font-weight: 500; }
    .cart-item-price { font-size: 11px; color: #6b7280; }
    .cart-item-actions { display: flex; align-items: center; gap: 8px; }
    .qty-btn { width: 24px; height: 24px; border-radius: 6px; border: 1px solid rgba(255, 8, 8, 0.2); background: rgba(255, 8, 8, 0.1); color: #FF4444; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 600; transition: all 0.2s; }
    .qty-btn:hover { background: rgba(255, 8, 8, 0.2); }
    .qty-add { background: rgba(6, 182, 212, 0.1); border-color: rgba(6, 182, 212, 0.2); color: #22d3ee; }
    .qty-add:hover { background: rgba(6, 182, 212, 0.2); }
    .qty-value { font-size: 13px; color: #FFF; min-width: 18px; text-align: center; font-weight: 600; }
    .cart-footer { display: flex; flex-direction: column; gap: 14px; padding-top: 14px; border-top: 1px solid rgba(255, 8, 8, 0.1); }
    .cart-total { display: flex; align-items: center; justify-content: space-between; }
    .total-label { font-size: 13px; font-weight: 600; color: #FFF; }
    .total-value { font-size: 22px; font-weight: 800; background: linear-gradient(135deg, #FF0808, #FF4444); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
    .checkout-btn { width: 100%; }
    .checkout-modal { display: flex; flex-direction: column; gap: 16px; align-items: center; }
    .checkout-icon { width: 64px; height: 64px; border-radius: 50%; background: rgba(34, 197, 94, 0.1); display: flex; align-items: center; justify-content: center; }
    .checkout-total { color: #FFF; font-size: 16px; text-align: center; margin: 0; }
    .checkout-success { color: #4ade80; text-align: center; font-size: 13px; margin: 0; }
    .form-actions { display: flex; justify-content: flex-end; width: 100%; }
    .catalog-modal { display: flex; flex-direction: column; gap: 16px; }
    .catalog-form { display: flex; flex-direction: column; gap: 10px; }
    .form-row { display: flex; gap: 8px; }
    .form-row .form-input { flex: 1; background: linear-gradient(135deg, rgba(28, 29, 32, 0.9), rgba(11, 14, 19, 0.8)); border: 1px solid rgba(255, 8, 8, 0.15); border-radius: 8px; padding: 8px 10px; color: #FFF; font-size: 12px; outline: none; }
    .form-row .form-input:focus { border-color: #FF0808; box-shadow: 0 0 0 3px rgba(255, 8, 8, 0.1); }
    .form-row select.form-input { cursor: pointer; }
    .form-actions-row { display: flex; justify-content: flex-end; gap: 8px; }
    .catalog-list { max-height: 300px; overflow-y: auto; padding-right: 4px; }
    .catalog-list-cat { margin-bottom: 12px; }
    .catalog-list-title { font-size: 11px; font-weight: 700; color: #FF0808; margin: 0 0 6px 0; text-transform: uppercase; letter-spacing: 0.5px; }
    .catalog-list-item { display: flex; align-items: center; gap: 8px; padding: 6px 8px; background: rgba(11, 14, 19, 0.4); border-radius: 6px; margin-bottom: 4px; }
    .catalog-list-name { flex: 1; font-size: 12px; color: #FFF; }
    .catalog-list-price { font-size: 11px; color: #4ade80; font-weight: 600; min-width: 50px; text-align: right; }
    .catalog-list-actions { display: flex; gap: 4px; }
    .cat-edit-btn, .cat-delete-btn { width: 22px; height: 22px; border-radius: 4px; border: none; cursor: pointer; font-size: 11px; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
    .cat-edit-btn { background: rgba(255, 8, 8, 0.15); color: #FF4444; }
    .cat-edit-btn:hover { background: rgba(255, 8, 8, 0.3); }
    .cat-delete-btn { background: rgba(239, 68, 68, 0.15); color: #fca5a5; }
    .cat-delete-btn:hover { background: rgba(239, 68, 68, 0.3); }
  `]
})
export class BuffetComponent implements OnInit {
  produits: Produit[] = [];
  allProduits: Produit[] = [];
  panier: PanierItem[] = [];
  categories: string[] = [];
  categorieFilter = 'all';
  showEncaissementModal = false;
  panierTotal = 0;

  showCatalogModal = false;
  editingProduit: Produit | null = null;
  productForm = { nom: '', categorie: '', prix: 0 };

  currencySymbol = '€';
  private settingsService = inject(SettingsService);

  constructor(
    private buffetService: BuffetService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.currencySymbol = this.settingsService.getCurrencySymbol();
    this.loadProduits();
    this.buffetService.panier$.subscribe(panier => { this.panier = panier; this.panierTotal = this.buffetService.getPanierTotal(); this.cdr.detectChanges(); });
  }

  loadProduits() {
    forkJoin({
      actifs: this.buffetService.getProduits(),
      tous: this.buffetService.getAllProduits()
    }).subscribe({
      next: ({ actifs, tous }) => {
        this.produits = actifs;
        this.allProduits = tous;
        const fromProducts = new Set(actifs.map(p => p.categorie));
        const fromSettings = this.settingsService.current.categoriesBuffet;
        this.categories = [...new Set([...fromSettings, ...fromProducts])];
        this.cdr.detectChanges();
      },
      error: (err) => console.error('loadProduits error:', err)
    });
  }

  get filteredProduits() { if (this.categorieFilter === 'all') return this.produits; return this.produits.filter(p => p.categorie === this.categorieFilter); }
  getProduitsByCat(cat: string): Produit[] { return this.allProduits.filter(p => p.categorie === cat); }
  getCartCount(): number { return this.panier.reduce((sum, item) => sum + item.quantite, 0); }
  getEmoji(categorie: string): string {
    const emojis: Record<string, string> = { 'Boissons': '🥤', 'Snacks': '🍿', 'Repas': '🍔', 'Desserts': '🍰', 'Café': '☕' };
    return emojis[categorie] || '🍴';
  }

  addToPanier(produit: Produit) { this.buffetService.addToPanier(produit); }
  removeFromPanier(produitId: number) { this.buffetService.removeFromPanier(produitId); }
  encaissementTotal = 0;
  encaisser() {
    this.buffetService.encaisser().subscribe((commande) => {
      this.encaissementTotal = commande.total;
      this.showEncaissementModal = true;
    });
  }
  closeEncaissementModal() { this.showEncaissementModal = false; }

  openCatalogModal() {
    this.showCatalogModal = true;
    this.editingProduit = null;
    this.productForm = { nom: '', categorie: '', prix: 0 };
    this.loadProduits();
  }

  closeCatalogModal() {
    this.showCatalogModal = false;
    this.editingProduit = null;
    this.productForm = { nom: '', categorie: '', prix: 0 };
  }

  editProduit(produit: Produit) {
    this.editingProduit = produit;
    this.productForm = { nom: produit.nom, categorie: produit.categorie, prix: produit.prix };
  }

  saveProduit() {
    if (!this.productForm.nom || !this.productForm.categorie || this.productForm.prix <= 0) return;

    if (this.productForm.categorie === 'new') {
      const newCat = prompt('Nom de la nouvelle catégorie:');
      if (!newCat) return;
      this.productForm.categorie = newCat;
    }

    const payload = {
      name: this.productForm.nom,
      category: this.productForm.categorie,
      price: this.productForm.prix
    };

    if (this.editingProduit) {
      this.buffetService.updateProduit(this.editingProduit.id, payload).subscribe({
        next: (updated) => {
          this.produits = this.produits.map(p => p.id === updated.id ? updated : p);
          this.allProduits = this.allProduits.map(p => p.id === updated.id ? updated : p);
          this.categories = [...new Set(this.produits.map(p => p.categorie))];
          this.productForm = { nom: '', categorie: '', prix: 0 };
          this.editingProduit = null;
          this.cdr.detectChanges();
        },
        error: (err) => alert('Erreur: ' + (err.error?.message || err.message))
      });
    } else {
      this.buffetService.addProduit(payload).subscribe({
        next: (nouveau) => {
          this.produits = [...this.produits, nouveau];
          this.allProduits = [...this.allProduits, nouveau];
          this.categories = [...new Set(this.produits.map(p => p.categorie))];
          this.productForm = { nom: '', categorie: '', prix: 0 };
          this.cdr.detectChanges();
        },
        error: (err) => alert('Erreur: ' + (err.error?.message || err.message))
      });
    }
  }

  deleteProduit(produit: Produit) {
    if (confirm(`Supprimer "${produit.nom}" ?`)) {
      this.buffetService.deleteProduit(produit.id).subscribe({
        next: () => {
          this.produits = this.produits.filter(p => p.id !== produit.id);
          this.allProduits = this.allProduits.filter(p => p.id !== produit.id);
          this.categories = [...new Set(this.produits.map(p => p.categorie))];
          this.cdr.detectChanges();
        },
        error: (err) => alert('Erreur: ' + (err.error?.message || err.message))
      });
    }
  }
}
