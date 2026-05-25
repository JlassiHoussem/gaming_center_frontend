import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { SettingsService } from '../../core/services/settings.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CardComponent } from '../../shared/components/card.component';
import { ButtonComponent } from '../../shared/components/button.component';
import { AppCurrencyPipe } from '../../shared/pipes/app-currency.pipe';
import { DepenseService } from '../../core/services/depense.service';
import { Depense } from '../../shared/models/shift.model';

@Component({
  selector: 'app-depenses',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CardComponent, ButtonComponent, AppCurrencyPipe],
  template: `
    <div class="page">
      <div class="hero-banner animate-fadeIn scan-overlay">
        <div class="hero-bg" style="background-image: url('gaming-setup-1.jpg')"></div>
        <div class="hero-content">
          <div class="hero-badge">FINANCES</div>
          <h1 class="hero-title">Gestion des <span class="gradient-text-red">Dépenses</span></h1>
          <p class="hero-subtitle">Suivi des dépenses du shift en cours</p>
        </div>
      </div>
      <div class="page-header animate-fadeIn">
        <div>
          <h2 class="page-title">Dépenses</h2>
          <p class="page-subtitle">Suivi des dépenses du shift en cours</p>
        </div>
        <app-button variant="secondary" (onClick)="printReport()">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
          Exporter
        </app-button>
      </div>
      <div class="period-tabs animate-fadeIn delay-100">
        <button *ngFor="let p of periods" class="period-btn" [class.active]="period === p.value" (click)="changePeriod(p.value)">{{ p.label }}</button>
      </div>
      <app-card class="add-card animate-slideUp delay-100">
        <form [formGroup]="depenseForm" (ngSubmit)="saveDepense()" class="add-form">
          <div class="form-group flex-grow">
            <label class="form-label">Libellé</label>
            <input formControlName="libelle" class="form-input" placeholder="Ex: Électricité, fournitures...">
          </div>
          <div class="form-group">
            <label class="form-label">Montant ({{ currencySymbol }})</label>
            <input type="number" formControlName="montant" class="form-input" placeholder="0.00" step="0.01">
          </div>
          <div class="form-actions">
            <app-button *ngIf="editingDepense" variant="secondary" (onClick)="cancelEdit()" type="button">
              Annuler
            </app-button>
            <app-button variant="primary" [disabled]="depenseForm.invalid" class="add-btn" (onClick)="saveDepense()">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path *ngIf="!editingDepense" d="M12 5v14M5 12h14"/>
                <path *ngIf="editingDepense" d="M5 13l4 4L19 7"/>
              </svg>
              {{ editingDepense ? 'Modifier' : 'Ajouter' }}
            </app-button>
          </div>
        </form>
      </app-card>
      <app-card class="table-card animate-slideUp delay-200">
        <div class="table-wrapper">
          <table class="table">
            <thead><tr><th>Libellé</th><th>Montant</th><th>Date</th><th>Actions</th></tr></thead>
            <tbody>
              <tr *ngFor="let depense of depenses; let i = index" [class]="'animate-fadeIn delay-' + (i * 50)">
                <td>
                  <div class="depense-cell">
                    <div class="depense-icon">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    </div>
                    <span>{{ depense.libelle }}</span>
                  </div>
                </td>
                <td class="text-red">{{ depense.montant | appCurrency }}</td>
                <td class="text-muted">{{ depense.date | date:'dd/MM/yyyy HH:mm' }}</td>
                <td>
                  <div class="action-btns">
                    <button class="edit-btn" (click)="editDepense(depense)">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                    <button class="delete-btn" (click)="deleteDepense(depense.id)">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="total-bar">
          <div class="total-info">
            <span class="total-label">Total des dépenses</span>
            <span class="total-count">{{ depenses.length }} dépense{{ depenses.length > 1 ? 's' : '' }}</span>
          </div>
          <span class="total-value text-red">{{ total | appCurrency }}</span>
        </div>
      </app-card>
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
    .add-card { padding: 16px 18px; }
    .add-form { display: flex; gap: 12px; align-items: flex-end; }
    .form-group { display: flex; flex-direction: column; gap: 6px; }
    .form-group.flex-grow { flex: 1; }
    .form-label { font-size: 11px; color: #6b7280; font-weight: 500; }
    .form-input { background: linear-gradient(135deg, rgba(28, 29, 32, 0.9), rgba(11, 14, 19, 0.8)); border: 1px solid rgba(255, 8, 8, 0.15); border-radius: 8px; padding: 10px 12px; color: #FFF; font-size: 13px; outline: none; transition: all 0.25s; width: 100%; box-sizing: border-box; }
    .form-input:hover { border-color: rgba(255, 8, 8, 0.3); }
    .form-input:focus { border-color: #FF0808; box-shadow: 0 0 0 3px rgba(255, 8, 8, 0.15); background: rgba(28, 29, 32, 0.95); }
    .form-input::placeholder { color: #6b7280; }
    .form-actions { display: flex; gap: 8px; }
    .table-card { padding: 0; overflow: hidden; }
    .table-wrapper { overflow-x: auto; }
    .table { width: 100%; border-collapse: collapse; }
    .table thead th { text-align: left; padding: 14px 16px; font-size: 10px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.8px; border-bottom: 1px solid rgba(255, 8, 8, 0.08); }
    .table tbody tr { border-bottom: 1px solid rgba(255, 8, 8, 0.06); transition: background 0.2s; }
    .table tbody tr:hover { background: rgba(255, 8, 8, 0.04); }
    .table tbody td { padding: 12px 16px; font-size: 13px; color: #FFF; }
    .depense-cell { display: flex; align-items: center; gap: 10px; }
    .depense-icon { width: 28px; height: 28px; border-radius: 8px; background: rgba(255, 8, 8, 0.1); display: flex; align-items: center; justify-content: center; color: #FF0808; flex-shrink: 0; }
    .text-red { color: #FF0808; font-weight: 600; } .text-muted { color: #6b7280; }
    .action-btns { display: flex; gap: 6px; }
    .edit-btn, .delete-btn { background: none; border: none; cursor: pointer; padding: 6px; border-radius: 6px; transition: all 0.2s; display: flex; align-items: center; justify-content: center; }
    .edit-btn { background: rgba(255, 8, 8, 0.1); color: #FF4444; }
    .edit-btn:hover { background: rgba(255, 8, 8, 0.2); }
    .delete-btn { background: rgba(239, 68, 68, 0.1); color: #f87171; }
    .delete-btn:hover { background: rgba(239, 68, 68, 0.2); }
    .total-bar { display: flex; align-items: center; justify-content: space-between; padding: 16px 18px; margin-top: 4px; border-top: 1px solid rgba(255, 8, 8, 0.08); }
    .total-info { display: flex; flex-direction: column; gap: 2px; }
    .total-label { font-size: 13px; font-weight: 600; color: #FFF; }
    .total-count { font-size: 11px; color: #6b7280; }
    .total-value { font-size: 24px; font-weight: 800; }
    .period-tabs { display: flex; gap: 8px; background: rgba(11, 14, 19, 0.4); padding: 4px; border-radius: 10px; width: fit-content; }
    .period-btn { padding: 8px 18px; border-radius: 8px; font-size: 12px; font-weight: 600; border: none; background: transparent; color: #6b7280; cursor: pointer; transition: all 0.25s; }
    .period-btn:hover { color: #FFF; }
    .period-btn.active { background: linear-gradient(135deg, #FF0808, #7A0202); color: #fff; box-shadow: 0 2px 12px rgba(255, 8, 8, 0.3); }
    @media print {
      .hero-banner, .page-header, .period-tabs, .add-card { display: none !important; }
      .table-card { border: none !important; background: transparent !important; backdrop-filter: none !important; }
      .table thead th { color: #000 !important; border-bottom: 2px solid #000 !important; }
      .table tbody td { color: #000 !important; }
      .total-bar { border-top-color: #000 !important; }
      .total-label, .total-count { color: #000 !important; }
      .action-btns { display: none !important; }
      .text-red { color: #dc2626 !important; }
    }
  `]
})
export class DepensesComponent implements OnInit {
  depenses: Depense[] = [];
  depenseForm: FormGroup;
  editingDepense: Depense | null = null;
  total = 0;
  currencySymbol = '€';
  period = 'all';
  periods = [
    { value: 'all', label: 'Tous' },
    { value: 'weekly', label: 'Semaine' },
    { value: 'monthly', label: 'Mois' },
    { value: 'annual', label: 'Année' }
  ];
  allDepenses: Depense[] = [];
  private settingsService = inject(SettingsService);

  constructor(
    private fb: FormBuilder,
    private depenseService: DepenseService,
    private cdr: ChangeDetectorRef
  ) {
    this.depenseForm = this.fb.group({
      libelle: ['', Validators.required],
      montant: [null, [Validators.required, Validators.min(0.01)]]
    });
  }

  ngOnInit() { this.currencySymbol = this.settingsService.getCurrencySymbol(); this.loadDepenses(); }

  loadDepenses() {
    this.depenseService.getDepenses().subscribe({
      next: (depenses) => {
        this.allDepenses = depenses;
        this.filterDepenses();
        this.cdr.detectChanges();
      },
      error: (err) => console.error('loadDepenses error:', err)
    });
  }

  changePeriod(period: string) { this.period = period; this.filterDepenses(); }

  filterDepenses() {
    if (this.period === 'all') {
      this.depenses = [...this.allDepenses];
    } else {
      const now = new Date();
      const cutoff = new Date();
      if (this.period === 'weekly') cutoff.setDate(now.getDate() - 7);
      else if (this.period === 'monthly') cutoff.setMonth(now.getMonth() - 1);
      else if (this.period === 'annual') cutoff.setFullYear(now.getFullYear() - 1);
      this.depenses = this.allDepenses.filter(d => new Date(d.date) >= cutoff);
    }
    this.calcTotal();
  }

  calcTotal() {
    this.total = this.depenses.reduce((sum, d) => sum + d.montant, 0);
  }

  printReport() { window.print(); }

  editDepense(depense: Depense) {
    this.editingDepense = depense;
    this.depenseForm.setValue({ libelle: depense.libelle, montant: depense.montant });
  }

  cancelEdit() {
    this.editingDepense = null;
    this.depenseForm.reset({ libelle: '', montant: null });
  }

  saveDepense() {
    if (this.depenseForm.invalid) return;
    const val = this.depenseForm.value;

    if (this.editingDepense) {
      this.depenseService.updateDepense(this.editingDepense.id, val).subscribe({
        next: (updated) => {
          this.allDepenses = this.allDepenses.map(d => d.id === updated.id ? updated : d);
          this.filterDepenses();
          this.cancelEdit();
          this.cdr.detectChanges();
        },
        error: (err) => alert('Erreur: ' + (err.error?.message || err.message))
      });
    } else {
      this.depenseService.addDepense(val).subscribe({
        next: (nouveau) => {
          this.allDepenses = [...this.allDepenses, nouveau];
          this.filterDepenses();
          this.depenseForm.reset({ libelle: '', montant: null });
          this.cdr.detectChanges();
        },
        error: (err) => alert('Erreur: ' + (err.error?.message || err.message))
      });
    }
  }

  deleteDepense(id: number) {
    const depense = this.allDepenses.find(d => d.id === id);
    if (!depense || !confirm(`Supprimer la dépense "${depense.libelle}" ?`)) return;
    this.depenseService.deleteDepense(id).subscribe({
      next: () => {
        this.allDepenses = this.allDepenses.filter(d => d.id !== id);
        this.filterDepenses();
        this.cdr.detectChanges();
      },
      error: (err) => alert('Erreur: ' + (err.error?.message || err.message))
    });
  }
}
