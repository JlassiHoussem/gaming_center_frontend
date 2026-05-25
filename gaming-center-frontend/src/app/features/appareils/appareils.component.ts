import { Component, OnInit, OnDestroy, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CardComponent } from '../../shared/components/card.component';
import { BadgeComponent } from '../../shared/components/badge.component';
import { ButtonComponent } from '../../shared/components/button.component';
import { ModalComponent } from '../../shared/components/modal.component';
import { AppareilService } from '../../core/services/appareil.service';
import { SettingsService } from '../../core/services/settings.service';
import { Appareil } from '../../shared/models/appareil.model';

@Component({
  selector: 'app-appareils',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CardComponent, BadgeComponent, ButtonComponent, ModalComponent],
  template: `
    <div class="page">
      <div class="hero-banner animate-fadeIn scan-overlay">
        <div class="hero-bg" style="background-image: url('gaming-console.jpg')"></div>
        <div class="hero-content">
          <div class="hero-badge">INVENTAIRE</div>
          <h1 class="hero-title">Gestion des <span class="gradient-text-red">Appareils</span></h1>
          <p class="hero-subtitle">Gérez vos appareils et sessions de jeu</p>
        </div>
      </div>
      <div class="page-header animate-fadeIn">
        <div>
          <h2 class="page-title">Tous les Appareils</h2>
          <p class="page-subtitle">{{ appareils.length }} appareil(s) enregistré(s)</p>
        </div>
        <app-button variant="primary" (onClick)="openFormModal()">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
          Ajouter Appareil
        </app-button>
      </div>
      <div class="filter-bar animate-fadeIn delay-100">
        <button *ngFor="let f of filters" class="filter-btn" [class.active]="filter === f.value" (click)="filter = f.value">
          <span class="filter-dot" [class]="f.color"></span>
          {{ f.label }}
          <span class="filter-count">{{ getFilterCount(f.value) }}</span>
        </button>
      </div>
      <div class="appareil-grid">
        <app-card *ngFor="let appareil of filteredAppareils; let i = index" class="appareil-card gaming-card-bg" [class.maintenance]="appareil.statut === 'maintenance'" [class]="'animate-slideUp delay-' + (i * 75)" style="background-image: linear-gradient(135deg, rgba(11,14,19,0.85), rgba(11,14,19,0.5)), url('gaming-setup-1.jpg');">
          <div class="appareil-card-inner">
            <div class="appareil-header">
              <div class="appareil-title-section">
                <span class="appareil-name">{{ appareil.nom }}</span>
                <span class="appareil-type">{{ appareil.type }}</span>
              </div>
              <app-badge [label]="appareil.statut === 'maintenance' ? 'En Panne' : appareil.statut" [variant]="appareil.statut === 'libre' ? 'success' : appareil.statut === 'occupe' ? 'danger' : 'warning'"></app-badge>
            </div>
            <div class="appareil-rate">{{ appareil.tarifHoraire }}{{ currencySymbol }}/heure</div>
            <div class="appareil-actions">
              <app-button variant="secondary" (onClick)="openFormModal(appareil)">Modifier</app-button>
              <app-button variant="danger" (onClick)="deleteAppareil(appareil)">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                Supprimer
              </app-button>
            </div>
          </div>
        </app-card>
      </div>
      <app-modal [isOpen]="showFormModal" [title]="editingAppareil ? 'Modifier Appareil' : 'Ajouter Appareil'" (closed)="closeFormModal()">
        <form [formGroup]="appareilForm" class="form">
          <div class="form-group"><label class="form-label">Nom</label><input formControlName="nom" class="form-input" placeholder="Ex: PC-01"></div>
          <div class="form-group"><label class="form-label">Type</label><select formControlName="type" class="form-input"><option *ngFor="let t of deviceTypes" [value]="t">{{ t }}</option></select></div>
          <div class="form-group"><label class="form-label">Tarif Horaire ({{ currencySymbol }})</label><input type="number" formControlName="tarifHoraire" class="form-input" placeholder="5"></div>
          <div class="form-group"><label class="form-label">Statut</label><select formControlName="statut" class="form-input"><option value="libre">Libre</option><option value="occupe">Occupé</option><option value="maintenance">En Panne</option></select></div>
          <div class="form-actions"><app-button variant="secondary" (onClick)="closeFormModal()">Annuler</app-button><app-button variant="primary" [disabled]="appareilForm.invalid" (onClick)="submitForm()">{{ editingAppareil ? 'Modifier' : 'Ajouter' }}</app-button></div>
        </form>
      </app-modal>
    </div>
  `,
  styles: [`
    .page { display: flex; flex-direction: column; gap: 24px; }

    .hero-banner {
      position: relative;
      border-radius: 16px;
      overflow: hidden;
      min-height: 160px;
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
      padding: 28px 32px;
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

    .page-header { display: flex; align-items: flex-start; justify-content: space-between; }
    .page-title { font-size: 24px; font-weight: 800; margin: 0; letter-spacing: -0.5px; color: #FFF; }
    .page-subtitle { font-size: 12px; color: #6b7280; margin: 4px 0 0 0; }
    .filter-bar { display: flex; gap: 8px; flex-wrap: wrap; }
    .filter-btn {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 8px 14px; border-radius: 8px; font-size: 12px; font-weight: 500;
      background: rgba(11, 14, 19, 0.5); border: 1px solid rgba(255, 8, 8, 0.1);
      color: #ABABAB; cursor: pointer; transition: all 0.25s;
    }
    .filter-btn:hover { background: rgba(11, 14, 19, 0.7); color: #FFF; }
    .filter-btn.active { background: rgba(255, 8, 8, 0.15); border-color: rgba(255, 8, 8, 0.3); color: #FFF; }
    .filter-dot { width: 6px; height: 6px; border-radius: 50%; }
    .filter-dot.dot-all { background: #FF0808; }
    .filter-dot.dot-libre { background: #4ade80; }
    .filter-dot.dot-occupe { background: #f87171; }
    .filter-dot.dot-maintenance { background: #fbbf24; }
    .filter-count { font-size: 10px; background: rgba(255, 8, 8, 0.1); padding: 1px 6px; border-radius: 10px; color: #6b7280; }
    .filter-btn.active .filter-count { background: rgba(255, 8, 8, 0.2); color: #FF4444; }
    .appareil-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
    @media (max-width: 1280px) { .appareil-grid { grid-template-columns: repeat(2, 1fr); } }
    @media (max-width: 768px) { .appareil-grid { grid-template-columns: 1fr; } }
    .appareil-card { min-height: 200px; }
    .appareil-card-inner { display: flex; flex-direction: column; gap: 16px; min-height: 160px; }
    .appareil-card.maintenance { opacity: 0.45; filter: grayscale(0.85); pointer-events: none; }
    .appareil-card.maintenance .appareil-actions { pointer-events: auto; }
    .appareil-card.maintenance .filter-btn, .appareil-card.maintenance .appareil-rate, .appareil-card.maintenance .appareil-type { color: #6b7280 !important; }
    .appareil-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }
    .appareil-title-section { display: flex; flex-direction: column; gap: 4px; flex: 1; }
    .appareil-name { font-size: 18px; font-weight: 800; color: #FFF; letter-spacing: -0.3px; }
    .appareil-type { font-size: 11px; color: #6b7280; text-transform: uppercase; letter-spacing: 1px; font-weight: 600; padding-top: 2px; }
    .appareil-rate { font-size: 15px; color: #FF0808; font-weight: 700; display: flex; align-items: center; gap: 8px; }
    .appareil-rate::before { content: ''; display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: #FF0808; opacity: 0.5; }
    .appareil-actions { display: flex; gap: 8px; flex-wrap: wrap; margin-top: auto; padding-top: 12px; border-top: 1px solid rgba(255, 255, 255, 0.06); }
    .form { display: flex; flex-direction: column; gap: 14px; }
    .form-group { display: flex; flex-direction: column; gap: 6px; }
    .form-label { font-size: 11px; color: #6b7280; font-weight: 500; }
    .form-input { background: linear-gradient(135deg, rgba(28, 29, 32, 0.9), rgba(11, 14, 19, 0.8)); border: 1px solid rgba(255, 8, 8, 0.15); border-radius: 8px; padding: 10px 12px; color: #FFF; font-size: 13px; outline: none; transition: all 0.25s; }
    .form-input:focus { border-color: #FF0808; box-shadow: 0 0 0 3px rgba(255, 8, 8, 0.1); }
    .form-actions { display: flex; gap: 8px; justify-content: flex-end; margin-top: 4px; }
  `]
})
export class AppareilsComponent implements OnInit, OnDestroy {
  appareils: Appareil[] = [];
  filter = 'tous';
  filters = [
    { value: 'tous', label: 'Tous', color: 'dot-all' },
    { value: 'libre', label: 'Libres', color: 'dot-libre' },
    { value: 'occupe', label: 'Occupés', color: 'dot-occupe' },
    { value: 'maintenance', label: 'Maintenance', color: 'dot-maintenance' }
  ];
  showFormModal = false;
  editingAppareil: Appareil | null = null;
  appareilForm: FormGroup;

  deviceTypes: string[] = [];
  currencySymbol = '€';

  private settingsService = inject(SettingsService);

  constructor(private fb: FormBuilder, private appareilService: AppareilService, private cdr: ChangeDetectorRef) {
    this.appareilForm = this.fb.group({
      nom: ['', Validators.required],
      type: ['PC', Validators.required],
      tarifHoraire: [5, [Validators.required, Validators.min(1)]],
      statut: ['libre', Validators.required]
    });
  }

  ngOnInit() {
    this.deviceTypes = this.settingsService.current.typesAppareils;
    this.currencySymbol = this.settingsService.getCurrencySymbol();
    if (this.deviceTypes.length > 0) {
      this.appareilForm.patchValue({ type: this.deviceTypes[0] });
    }
    setTimeout(() => this.loadAppareils());
  }
  ngOnDestroy() {}
  loadAppareils() {
    this.appareilService.getAppareils().subscribe({
      next: (appareils) => {
        this.appareils = [...appareils];
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Failed to load devices', err)
    });
  }
  get filteredAppareils() { if (this.filter === 'tous') return this.appareils; return this.appareils.filter(a => a.statut === this.filter); }
  getFilterCount(value: string): number { if (value === 'tous') return this.appareils.length; return this.appareils.filter(a => a.statut === value).length; }

  openFormModal(appareil?: Appareil) {
    this.editingAppareil = appareil || null;
    if (appareil) {
      this.appareilForm.patchValue(appareil);
      this.appareilForm.updateValueAndValidity();
    } else {
      this.appareilForm.reset({ nom: '', type: this.deviceTypes[0] || 'PC', tarifHoraire: 5, statut: 'libre' });
    }
    this.showFormModal = true;
    this.cdr.detectChanges();
  }
  closeFormModal() { this.showFormModal = false; this.editingAppareil = null; }
  submitForm() {
    if (!this.appareilForm.valid) return;
    const formValue = this.appareilForm.value;
    if (this.editingAppareil) {
      const wasOccupied = this.editingAppareil.statut === 'occupe';
      const willBeOccupied = formValue.statut === 'occupe';
      const doUpdate = () => {
        this.appareilService.updateAppareil(this.editingAppareil!.id, formValue).subscribe({
          next: () => { this.loadAppareils(); this.closeFormModal(); },
          error: (err) => alert('Erreur: ' + (err.error?.message || err.message))
        });
      };
      if (wasOccupied && !willBeOccupied) {
        this.appareilService.stopSession(this.editingAppareil.id).subscribe({
          next: () => doUpdate(),
          error: () => doUpdate()
        });
      } else if (!wasOccupied && willBeOccupied) {
        this.appareilService.startSession(this.editingAppareil.id).subscribe({
          next: () => doUpdate(),
          error: () => doUpdate()
        });
      } else {
        doUpdate();
      }
    } else {
      this.appareilService.addAppareil({ ...formValue }).subscribe({
        next: () => { this.loadAppareils(); this.closeFormModal(); },
        error: (err) => alert('Erreur: ' + (err.error?.message || err.message))
      });
    }
  }
  deleteAppareil(appareil: Appareil) {
    if (appareil.statut === 'occupe') {
      alert('Impossible de supprimer un appareil avec une session en cours. Arrêtez d\'abord la session depuis le Dashboard.');
      return;
    }
    if (confirm(`Supprimer "${appareil.nom}" ?`)) {
      this.appareilService.deleteAppareil(appareil.id).subscribe({
        next: () => {
          this.appareils = this.appareils.filter(a => a.id !== appareil.id);
          this.cdr.detectChanges();
        },
        error: (err) => alert('Erreur lors de la suppression: ' + (err.error?.message || err.message))
      });
    }
  }
}
