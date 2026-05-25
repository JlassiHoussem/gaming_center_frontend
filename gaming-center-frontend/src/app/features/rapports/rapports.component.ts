import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../../shared/components/card.component';
import { ButtonComponent } from '../../shared/components/button.component';
import { AppCurrencyPipe } from '../../shared/pipes/app-currency.pipe';
import { RapportService } from '../../core/services/rapport.service';
import { RapportData, TopProduit, ShiftSummary } from '../../shared/models/rapport.model';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-rapports',
  standalone: true,
  imports: [CommonModule, CardComponent, ButtonComponent, AppCurrencyPipe],
  template: `
    <div class="page">
      <div class="hero-banner animate-fadeIn scan-overlay">
        <div class="hero-bg" style="background-image: url('gaming-setup-2.jpg')"></div>
        <div class="hero-content">
          <div class="hero-badge">ANALYTICS</div>
          <h1 class="hero-title">Rapports & <span class="gradient-text-red">Analytics</span></h1>
          <p class="hero-subtitle">Analysez les performances de votre gaming center</p>
        </div>
      </div>
      <div class="page-header animate-fadeIn">
        <div>
          <h2 class="page-title">Rapports & Analytics</h2>
          <p class="page-subtitle">Analysez les performances de votre gaming center</p>
        </div>
        <app-button variant="secondary" (onClick)="printReport()">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
          Imprimer
        </app-button>
      </div>
      <div class="period-tabs animate-fadeIn delay-100">
        <button *ngFor="let p of periods" class="period-btn" [class.active]="period === p.value" (click)="changePeriod(p.value)">{{ p.label }}</button>
      </div>
      <div class="kpi-row animate-slideUp delay-200">
        <app-card class="kpi-mini"><div class="kpi-mini-content"><span class="kpi-mini-label">Total Ventes</span><span class="kpi-mini-value gradient-text">{{ rapport?.totalVentes | appCurrency }}</span></div></app-card>
        <app-card class="kpi-mini"><div class="kpi-mini-content"><span class="kpi-mini-label">Total Dépenses</span><span class="kpi-mini-value text-red">{{ rapport?.totalDepenses | appCurrency }}</span></div></app-card>
        <app-card class="kpi-mini"><div class="kpi-mini-content"><span class="kpi-mini-label">Bénéfice Net</span><span class="kpi-mini-value text-green">{{ rapport?.beneficeNet | appCurrency }}</span></div></app-card>
      </div>
      <div class="charts-grid animate-slideUp delay-300">
        <app-card class="chart-card">
          <h3 class="chart-title">Revenus dans le temps</h3>
          <canvas id="revenusChart" height="200"></canvas>
        </app-card>
        <app-card class="chart-card">
          <h3 class="chart-title">Heures d'utilisation par appareil</h3>
          <canvas id="appareilsChart" height="200"></canvas>
        </app-card>
        <app-card class="chart-card">
          <h3 class="chart-title">Répartition des ventes buffet</h3>
          <canvas id="buffetChart" height="200"></canvas>
        </app-card>
        <app-card class="chart-card">
          <h3 class="chart-title">Top Produits</h3>
          <table class="table">
            <thead><tr><th>#</th><th>Produit</th><th>Quantité</th><th>Revenus</th></tr></thead>
            <tbody><tr *ngFor="let p of rapport?.topProduits"><td><span class="rank-badge">{{ p.rang }}</span></td><td>{{ p.nom }}</td><td>{{ p.quantite }}</td><td class="text-green">{{ p.revenus | appCurrency }}</td></tr></tbody>
          </table>
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

    .period-tabs { display: flex; gap: 8px; background: rgba(11, 14, 19, 0.4); padding: 4px; border-radius: 10px; width: fit-content; }
    .period-btn { padding: 8px 18px; border-radius: 8px; font-size: 12px; font-weight: 600; border: none; background: transparent; color: #6b7280; cursor: pointer; transition: all 0.25s; }
    .period-btn:hover { color: #FFF; }
    .period-btn.active { background: linear-gradient(135deg, #FF0808, #7A0202); color: #fff; box-shadow: 0 2px 12px rgba(255, 8, 8, 0.3); }
    .kpi-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
    @media (max-width: 768px) { .kpi-row { grid-template-columns: 1fr; } }
    .kpi-mini { padding: 16px 18px; }
    .kpi-mini-content { display: flex; flex-direction: column; gap: 4px; }
    .kpi-mini-label { font-size: 11px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.8px; font-weight: 600; }
    .kpi-mini-value { font-size: 24px; font-weight: 800; }
    .text-green { color: #4ade80; } .text-red { color: #f87171; }
    .charts-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
    @media (max-width: 1024px) { .charts-grid { grid-template-columns: 1fr; } }
    .chart-card { padding: 18px; }
    .chart-title { font-size: 14px; font-weight: 700; color: #FFF; margin: 0 0 16px 0; }
    .tables-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
    @media (max-width: 1024px) { .tables-grid { grid-template-columns: 1fr; } }
    .table-card { padding: 18px; }
    .table { width: 100%; border-collapse: collapse; }
    .table thead th { text-align: left; padding: 10px 12px; font-size: 10px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.8px; border-bottom: 1px solid rgba(255, 8, 8, 0.08); }
    .table tbody tr { border-bottom: 1px solid rgba(255, 8, 8, 0.06); }
    .table tbody tr:hover { background: rgba(255, 8, 8, 0.04); }
    .table tbody td { padding: 10px 12px; font-size: 12px; color: #FFF; }
    .rank-badge { display: inline-flex; align-items: center; justify-content: center; width: 22px; height: 22px; border-radius: 6px; font-size: 10px; font-weight: 700; }
    .rank-badge:nth-child(1) { background: linear-gradient(135deg, rgba(255, 8, 8, 0.2), rgba(122, 2, 2, 0.2)); color: #FF0808; }
    .table-scroll { overflow-x: auto; }
  `]
})
export class RapportsComponent implements OnInit, AfterViewInit {
  @ViewChild('revenusChart') revenusChartEl!: ElementRef;
  period = 'weekly';
  periods = [
    { value: 'weekly', label: 'Semaine' },
    { value: 'monthly', label: 'Mois' },
    { value: 'annual', label: 'Année' }
  ];
  rapport: RapportData | null = null;
  private charts: Chart[] = [];

  constructor(private rapportService: RapportService, private cdr: ChangeDetectorRef) {}

  ngOnInit() { setTimeout(() => this.loadRapport()); }

  ngAfterViewInit() { setTimeout(() => this.createCharts(), 100); }

  loadRapport() { this.rapportService.getRapport(this.period).subscribe(r => { this.rapport = r; this.cdr.detectChanges(); setTimeout(() => this.createCharts(), 100); }); }

  changePeriod(period: string) { this.period = period; this.loadRapport(); }

  createCharts() {
    this.charts.forEach(c => c.destroy());
    this.charts = [];
    if (!this.rapport) return;
    const labels = this.rapport.revenusParJour.map(r => r.jour);
    const sessionsData = this.rapport.revenusParJour.map(r => r.sessions);
    const buffetData = this.rapport.revenusParJour.map(r => r.buffet);

    this.charts.push(new Chart('revenusChart', {
      type: 'line',
      data: {
        labels,
        datasets: [
          { label: 'Sessions', data: sessionsData, borderColor: '#8B5CF6', backgroundColor: 'rgba(139, 92, 246, 0.1)', fill: true, tension: 0.4, pointRadius: 3, pointBackgroundColor: '#8B5CF6' },
          { label: 'Buffet', data: buffetData, borderColor: '#06B6D4', backgroundColor: 'rgba(6, 182, 212, 0.1)', fill: true, tension: 0.4, pointRadius: 3, pointBackgroundColor: '#06B6D4' }
        ]
      },
      options: { responsive: true, plugins: { legend: { labels: { color: '#94a3b8', font: { size: 11 } } } }, scales: { x: { ticks: { color: '#6b7280' }, grid: { color: 'rgba(139, 92, 246, 0.06)' } }, y: { ticks: { color: '#6b7280' }, grid: { color: 'rgba(139, 92, 246, 0.06)' } } } }
    }));

    this.charts.push(new Chart('appareilsChart', {
      type: 'bar',
      data: {
        labels: this.rapport.heuresParAppareil.map(h => h.nom),
        datasets: [{ label: 'Heures', data: this.rapport.heuresParAppareil.map(h => h.heures), backgroundColor: ['rgba(139, 92, 246, 0.6)', 'rgba(6, 182, 212, 0.6)', 'rgba(34, 197, 94, 0.6)', 'rgba(234, 179, 8, 0.6)', 'rgba(236, 72, 153, 0.6)', 'rgba(59, 130, 246, 0.6)', 'rgba(239, 68, 68, 0.6)', 'rgba(168, 85, 247, 0.6)'], borderRadius: 6 }]
      },
      options: { responsive: true, plugins: { legend: { display: false } }, scales: { x: { ticks: { color: '#6b7280' }, grid: { display: false } }, y: { ticks: { color: '#6b7280' }, grid: { color: 'rgba(139, 92, 246, 0.06)' } } } }
    }));

    const top3 = this.rapport.topProduits.slice(0, 5);
    this.charts.push(new Chart('buffetChart', {
      type: 'doughnut',
      data: {
        labels: top3.map(p => p.nom),
        datasets: [{ data: top3.map(p => p.quantite), backgroundColor: ['rgba(139, 92, 246, 0.7)', 'rgba(6, 182, 212, 0.7)', 'rgba(34, 197, 94, 0.7)', 'rgba(234, 179, 8, 0.7)', 'rgba(236, 72, 153, 0.7)'], borderWidth: 0 }]
      },
      options: { responsive: true, plugins: { legend: { position: 'right', labels: { color: '#94a3b8', font: { size: 11 }, padding: 12 } } } }
    }));
  }

  printReport() { window.print(); }
}
