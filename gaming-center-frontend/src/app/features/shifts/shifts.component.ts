import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../../shared/components/card.component';
import { ButtonComponent } from '../../shared/components/button.component';
import { ModalComponent } from '../../shared/components/modal.component';
import { AppCurrencyPipe } from '../../shared/pipes/app-currency.pipe';
import { ShiftService } from '../../core/services/shift.service';
import { Shift } from '../../shared/models/shift.model';

@Component({
  selector: 'app-shifts',
  standalone: true,
  imports: [CommonModule, CardComponent, ButtonComponent, ModalComponent, AppCurrencyPipe],
  template: `
    <div class="page">
      <div class="hero-banner animate-fadeIn scan-overlay">
        <div class="hero-bg" style="background-image: url('gaming-device.jpg')"></div>
        <div class="hero-content">
          <div class="hero-badge">PLANNING</div>
          <h1 class="hero-title">Gestion des <span class="gradient-text-red">Shifts</span></h1>
          <p class="hero-subtitle">Ouverture, suivi et fermeture des shifts</p>
        </div>
      </div>
      <div class="page-header animate-fadeIn">
        <div>
          <h2 class="page-title">Gestion des Shifts</h2>
          <p class="page-subtitle">Ouverture, suivi et fermeture des shifts</p>
        </div>
      </div>
      <app-card *ngIf="currentShift" class="shift-status-card animate-slideUp delay-100">
        <div class="shift-status-inner">
          <div class="shift-status-left">
            <div class="shift-live-indicator">
              <span class="live-dot"></span>
              <span class="live-text">EN COURS</span>
            </div>
            <div class="shift-time-info">
              <span class="shift-open-time">Ouvert à {{ currentShift.dateOuverture | date:'HH:mm' }}</span>
              <span class="shift-duration">Durée: {{ getDuration() }}</span>
            </div>
          </div>
          <app-button variant="danger" (onClick)="openCloseModal()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 16l4-4m0 0l-4-4m6 4H7a2 2 0 01-2-2V6a2 2 0 012-2h4"/></svg>
            Fermer Shift
          </app-button>
        </div>
      </app-card>
      <app-card *ngIf="!currentShift" class="shift-empty-card animate-slideUp delay-100">
        <div class="shift-empty-inner">
          <div class="shift-empty-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>
          </div>
          <span class="empty-text">Aucun shift en cours</span>
          <app-button variant="primary" (onClick)="openShift()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 8l4 4m0 0l-4 4m6-4H7a2 2 0 01-2-2V6a2 2 0 012-2h4"/></svg>
            Ouvrir Nouveau Shift
          </app-button>
        </div>
      </app-card>
      <div class="section-header animate-fadeIn delay-200">
        <h3 class="section-title">Historique des Shifts</h3>
      </div>
      <app-card class="table-card animate-slideUp delay-300">
        <div class="table-wrapper">
          <table class="table">
            <thead><tr><th>Date</th><th>Ouverture</th><th>Fermeture</th><th>Sessions</th><th>Buffet</th><th>Dépenses</th><th>Bénéfice</th></tr></thead>
            <tbody>
              <tr *ngFor="let shift of historique; let i = index" [class]="'animate-fadeIn delay-' + (i * 50)">
                <td>{{ shift.dateOuverture | date:'dd/MM/yyyy' }}</td>
                <td class="text-muted">{{ shift.dateOuverture | date:'HH:mm' }}</td>
                <td class="text-muted">{{ shift.dateFermeture ? (shift.dateFermeture | date:'HH:mm') : '—' }}</td>
                <td class="text-green">{{ shift.revenusSessions | appCurrency }}</td>
                <td class="text-green">{{ shift.revenusBuffet | appCurrency }}</td>
                <td class="text-red">{{ shift.totalDepenses | appCurrency }}</td>
                <td [class]="shift.benefice >= 0 ? 'text-green' : 'text-red'">{{ shift.benefice | appCurrency }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </app-card>
      <app-modal [isOpen]="showCloseModal" title="Fermer Shift" (closed)="closeModal()">
        <div class="close-modal">
          <div class="summary-box">
            <div class="summary-row"><span class="summary-label">Revenus Sessions</span><span class="summary-value text-green">{{ currentShift?.revenusSessions | appCurrency }}</span></div>
            <div class="summary-row"><span class="summary-label">Revenus Buffet</span><span class="summary-value text-green">{{ currentShift?.revenusBuffet | appCurrency }}</span></div>
            <div class="summary-row"><span class="summary-label">Dépenses</span><span class="summary-value text-red">{{ currentShift?.totalDepenses | appCurrency }}</span></div>
            <div class="summary-divider"></div>
            <div class="summary-row summary-total"><span class="summary-label">Bénéfice Net</span><span class="summary-value" [class]="getBenefice() >= 0 ? 'text-green' : 'text-red'">{{ getBenefice() | appCurrency }}</span></div>
          </div>
          <div class="form-actions">
            <app-button variant="secondary" (onClick)="closeModal()">Annuler</app-button>
            <app-button variant="danger" (onClick)="closeShift()">Confirmer Fermeture</app-button>
          </div>
        </div>
      </app-modal>
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
    .shift-status-card { padding: 0; overflow: hidden; }
    .shift-status-inner { display: flex; align-items: center; justify-content: space-between; padding: 20px 22px; }
    .shift-status-left { display: flex; align-items: center; gap: 20px; }
    .shift-live-indicator { display: flex; align-items: center; gap: 8px; background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.2); padding: 6px 12px; border-radius: 20px; }
    .live-dot { width: 8px; height: 8px; border-radius: 50%; background: #f87171; animation: pulse-glow 1.5s ease-in-out infinite; }
    .live-text { font-size: 10px; font-weight: 700; color: #f87171; letter-spacing: 1px; }
    .shift-time-info { display: flex; flex-direction: column; gap: 2px; }
    .shift-open-time { font-size: 18px; font-weight: 700; color: #FF0808; }
    .shift-duration { font-size: 12px; color: #6b7280; }
    .shift-empty-card { padding: 0; overflow: hidden; }
    .shift-empty-inner { display: flex; flex-direction: column; align-items: center; gap: 16px; padding: 48px 20px; }
    .shift-empty-icon { width: 64px; height: 64px; border-radius: 50%; background: rgba(139, 92, 246, 0.1); display: flex; align-items: center; justify-content: center; color: #8B5CF6; }
    .empty-text { color: #6b7280; font-size: 13px; }
    .section-header { display: flex; align-items: center; justify-content: space-between; }
    .section-title { font-size: 16px; font-weight: 700; color: #FFF; margin: 0; }
    .table-card { padding: 0; overflow: hidden; }
    .table-wrapper { overflow-x: auto; }
    .table { width: 100%; border-collapse: collapse; }
    .table thead th { text-align: left; padding: 14px 16px; font-size: 10px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.8px; border-bottom: 1px solid rgba(255, 8, 8, 0.08); }
    .table tbody tr { border-bottom: 1px solid rgba(255, 8, 8, 0.06); transition: background 0.2s; }
    .table tbody tr:hover { background: rgba(255, 8, 8, 0.04); }
    .table tbody td { padding: 12px 16px; font-size: 13px; color: #FFF; }
    .text-green { color: #4ade80; font-weight: 600; } .text-red { color: #FF0808; font-weight: 600; } .text-muted { color: #6b7280; }
    .close-modal { display: flex; flex-direction: column; gap: 20px; }
    .summary-box { background: rgba(11, 14, 19, 0.6); border-radius: 12px; padding: 18px; display: flex; flex-direction: column; gap: 12px; }
    .summary-row { display: flex; align-items: center; justify-content: space-between; }
    .summary-label { font-size: 12px; color: #6b7280; }
    .summary-value { font-size: 14px; font-weight: 600; }
    .summary-divider { height: 1px; background: rgba(255, 8, 8, 0.1); margin: 4px 0; }
    .summary-total .summary-label { font-size: 14px; font-weight: 600; color: #FFF; }
    .summary-total .summary-value { font-size: 20px; font-weight: 800; }
    .form-actions { display: flex; gap: 8px; justify-content: flex-end; }
  `]
})
export class ShiftsComponent implements OnInit, OnDestroy {
  currentShift: Shift | null = null;
  historique: Shift[] = [];
  showCloseModal = false;
  private timer: any;

  constructor(private shiftService: ShiftService) {}

  ngOnInit() { this.loadShift(); this.timer = setInterval(() => { if (this.currentShift) { this.currentShift = { ...this.currentShift }; } }, 60000); }
  ngOnDestroy() { if (this.timer) { clearInterval(this.timer); } }
  loadShift() { this.shiftService.getCurrentShift().subscribe(shift => { this.currentShift = shift; }); this.shiftService.getHistorique().subscribe(shifts => { this.historique = shifts; }); }

  getDuration(): string {
    if (!this.currentShift) return '';
    const elapsed = Date.now() - new Date(this.currentShift.dateOuverture).getTime();
    const hours = Math.floor(elapsed / 3600000);
    const minutes = Math.floor((elapsed % 3600000) / 60000);
    return `\${hours}h \${minutes}min`;
  }

  getBenefice(): number { if (!this.currentShift) return 0; return this.currentShift.revenusSessions + this.currentShift.revenusBuffet - this.currentShift.totalDepenses; }
  openShift() { this.shiftService.openShift().subscribe(() => this.loadShift()); }
  openCloseModal() { this.showCloseModal = true; }
  closeShift() { this.shiftService.closeShift().subscribe(() => { this.closeModal(); this.loadShift(); }); }
  closeModal() { this.showCloseModal = false; }
}
