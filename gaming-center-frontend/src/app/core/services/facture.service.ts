import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import { SettingsService } from './settings.service';

export interface FactureItem {
  name: string;
  quantity: number;
  price: number;
}

export interface FactureData {
  sessionId: number;
  deviceName: string;
  deviceType: string;
  startTime: string;
  endTime: string;
  duration: number;
  hourlyRate: number;
  sessionAmount: number;
  items: FactureItem[];
  itemsTotal: number;
  totalAmount: number;
}

@Injectable({ providedIn: 'root' })
export class FactureService {
  constructor(private settingsService: SettingsService) {}

  private get sym(): string { return this.settingsService.getCurrencySymbol(); }

  generateFacture(data: FactureData): void {
    const doc = new jsPDF();
    const pw = doc.internal.pageSize.getWidth();
    const ph = doc.internal.pageSize.getHeight();
    const ml = 20;
    const mr = 20;
    const cw = pw - ml - mr;
    let y = 0;

    // === WHITE BACKGROUND ===
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, pw, ph, 'F');

    // === HEADER: Red gradient bar ===
    const headerH = 10;
    for (let i = 0; i < headerH; i++) {
      const t = i / headerH;
      const r = Math.round(255 - (20 - 255) * t);
      const g = Math.round(8 - (8 - 8) * t);
      const b = Math.round(8 - (20 - 8) * t);
      doc.setFillColor(Math.min(255, r), Math.min(255, g), Math.min(255, b));
      doc.rect(0, i, pw, 1, 'F');
    }

    // Red bottom accent line
    doc.setDrawColor(255, 8, 8);
    doc.setLineWidth(1.5);
    doc.line(0, headerH, pw, headerH);

    // === TITLE SECTION ===
    y = headerH + 20;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(24);
    doc.setTextColor(30, 30, 30);
    doc.text('FACTURE', ml, y);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(180, 180, 180);
    doc.text(`N° ${data.sessionId.toString().padStart(6, '0')}`, ml + 55, y - 2);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(160, 160, 160);
    doc.text(`Date : ${new Date().toLocaleDateString('fr-FR')}`, pw - mr, y, { align: 'right' });

    // Thin separator
    y += 8;
    doc.setDrawColor(230, 230, 230);
    doc.setLineWidth(0.5);
    doc.line(ml, y, pw - mr, y);

    // === CLIENT INFO & SESSION INFO - 2 column layout ===
    y += 16;
    const colW = (cw - 20) / 2;

    // Left: Gaming Center info
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(255, 8, 8);
    doc.text('GAMING CENTER', ml, y);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(120, 120, 120);
    doc.text('Espace gaming professionnel', ml, y + 7);

    // Right: Session info
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(80, 80, 80);
    let ry = y;
    const rightX = ml + colW + 10;

    const addDetail = (label: string, value: string) => {
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(160, 160, 160);
      doc.text(label, rightX, ry);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(50, 50, 50);
      doc.text(value, rightX + 45, ry);
      ry += 6;
    };
    addDetail('Session :', `#${data.sessionId.toString().padStart(6, '0')}`);
    addDetail('Début :', data.startTime);
    addDetail('Fin :', data.endTime);
    addDetail('Durée :', `${data.duration.toFixed(2)} heures`);

    // === DEVICE INFO CARD ===
    y = Math.max(y + 30, ry + 8);
    const cardY = y;
    const cardH = 60;
    const cardRadius = 10;

    doc.setFillColor(248, 249, 251);
    doc.roundedRect(ml, cardY, cw, cardH, cardRadius, cardRadius, 'F');
    doc.setDrawColor(230, 230, 230);
    doc.setLineWidth(0.3);
    doc.roundedRect(ml, cardY, cw, cardH, cardRadius, cardRadius, 'S');

    // Red left accent
    doc.setFillColor(255, 8, 8);
    doc.rect(ml + 1, cardY + 10, 3, cardH - 20, 'F');

    const colPositions = [
      ml + 14,
      ml + 54,
      ml + 94,
      ml + 134
    ];
    const addDeviceField = (label: string, value: string, idx: number) => {
      const x = colPositions[idx];
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(160, 160, 160);
      doc.text(label, x, cardY + 20);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(50, 50, 50);
      doc.text(value, x, cardY + 38);
    };
    addDeviceField('Appareil', data.deviceName, 0);
    addDeviceField('Type', data.deviceType, 1);
    addDeviceField('Tarif horaire', `${data.hourlyRate.toFixed(2)} ${this.sym}/h`, 2);
    addDeviceField('Coût session', `${data.sessionAmount.toFixed(2)} ${this.sym}`, 3);

    // === BUFFET TABLE ===
    if (data.items.length > 0) {
      y = cardY + cardH + 18;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(50, 50, 50);
      doc.text('BUFFET & BOISSONS', ml, y);
      y += 10;

      // Table header
      const qteX = 88;
      const puX = 125;
      const totalX = cw - 6;

      doc.setFillColor(255, 8, 8);
      doc.rect(ml, y - 5, cw, 8, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(255, 255, 255);
      doc.text('Désignation', ml + 8, y);
      doc.text('Qté', ml + qteX, y, { align: 'center' });
      doc.text('P.U.', ml + puX, y, { align: 'center' });
      doc.text('Total', ml + totalX, y, { align: 'right' });
      y += 9;

      // Table rows
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      data.items.forEach((item, idx) => {
        if (y > ph - 50) {
          doc.addPage();
          doc.setFillColor(255, 255, 255);
          doc.rect(0, 0, pw, ph, 'F');
          y = 20;
        }
        if (idx % 2 === 1) {
          doc.setFillColor(248, 249, 251);
          doc.rect(ml, y - 4, cw, 8, 'F');
        }
        doc.setTextColor(80, 80, 80);
        doc.text(item.name, ml + 8, y);
        doc.text(item.quantity.toString(), ml + qteX, y, { align: 'center' });
        doc.text(`${item.price.toFixed(2)} ${this.sym}`, ml + puX, y, { align: 'center' });
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(50, 50, 50);
        doc.text(`${(item.quantity * item.price).toFixed(2)} ${this.sym}`, ml + totalX, y, { align: 'right' });
        doc.setFont('helvetica', 'normal');
        y += 8;
      });

      // Table footer line
      doc.setDrawColor(230, 230, 230);
      doc.setLineWidth(0.5);
      doc.line(ml, y, pw - mr, y);
      y += 6;

      // Total buffet
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(80, 80, 80);
      doc.text('TOTAL BUFFET', ml + qteX - 10, y);
      doc.setTextColor(255, 8, 8);
      doc.text(`${data.itemsTotal.toFixed(2)} ${this.sym}`, ml + totalX, y, { align: 'right' });
      y += 14;
    } else {
      y = cardY + cardH + 18;
    }

    // === DIVIDER ===
    doc.setDrawColor(230, 230, 230);
    doc.setLineWidth(0.3);
    doc.line(ml, y, pw - mr, y);
    y += 12;

    // === CALCULATION BREAKDOWN ===
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(160, 160, 160);
    doc.text('Détail du calcul', ml, y);
    y += 7;

    const addCalcLine = (label: string, value: string) => {
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(120, 120, 120);
      doc.text(label, ml, y);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(50, 50, 50);
      doc.text(value, pw - mr, y, { align: 'right' });
      y += 7;
    };

    addCalcLine(
      `Session (${data.duration.toFixed(2)}h x ${data.hourlyRate.toFixed(2)} ${this.sym})`,
      `${data.sessionAmount.toFixed(2)} ${this.sym}`
    );
    if (data.items.length > 0) {
      addCalcLine('Buffet & Boissons', `${data.itemsTotal.toFixed(2)} ${this.sym}`);
    }
    y += 2;

    // === TOTAL BOX ===
    doc.setFillColor(255, 8, 8);
    doc.roundedRect(ml, y - 5, cw, 30, 5, 5, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255);
    doc.text('TOTAL À PAYER', ml + 15, y + 10);

    doc.setFontSize(22);
    doc.text(`${data.totalAmount.toFixed(2)} ${this.sym}`, pw - mr - 15, y + 10, { align: 'right' });

    // === FOOTER ===
    y = ph - 25;
    doc.setDrawColor(255, 8, 8);
    doc.setLineWidth(0.5);
    doc.line(ml, y, pw - mr, y);
    y += 8;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(180, 180, 180);
    doc.text('Merci de votre visite !', pw / 2, y, { align: 'center' });
    y += 5;
    doc.text('Gaming Center © 2026', pw / 2, y, { align: 'center' });

    doc.save(`facture-session-${data.sessionId}-${data.deviceName}.pdf`);
  }
}
