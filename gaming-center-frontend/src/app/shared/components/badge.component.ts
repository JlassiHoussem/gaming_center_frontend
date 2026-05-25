import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-badge',
  standalone: true,
  template: `
    <span class="badge" [class]="variantClass">
      <span class="badge-dot"></span>
      {{ label }}
    </span>
  `,
  styles: [`
    .badge {
      display: inline-flex; align-items: center; gap: 5px;
      padding: 3px 10px; border-radius: 20px;
      font-size: 10px; font-weight: 600; text-transform: capitalize;
      letter-spacing: 0.3px;
    }
    .badge-dot {
      width: 5px; height: 5px; border-radius: 50%;
    }
    .badge-success {
      background: rgba(34, 197, 94, 0.1);
      color: #4ade80;
      border: 1px solid rgba(34, 197, 94, 0.2);
    }
    .badge-success .badge-dot { background: #4ade80; box-shadow: 0 0 6px rgba(74, 222, 128, 0.6); }
    .badge-danger {
      background: rgba(239, 68, 68, 0.1);
      color: #f87171;
      border: 1px solid rgba(239, 68, 68, 0.2);
    }
    .badge-danger .badge-dot { background: #f87171; box-shadow: 0 0 6px rgba(248, 113, 113, 0.6); animation: pulse-glow 1.5s ease-in-out infinite; }
    .badge-warning {
      background: rgba(234, 179, 8, 0.1);
      color: #fbbf24;
      border: 1px solid rgba(234, 179, 8, 0.2);
    }
    .badge-warning .badge-dot { background: #fbbf24; box-shadow: 0 0 6px rgba(251, 191, 36, 0.6); }
    .badge-info {
      background: rgba(6, 182, 212, 0.1);
      color: #22d3ee;
      border: 1px solid rgba(6, 182, 212, 0.2);
    }
    .badge-info .badge-dot { background: #22d3ee; box-shadow: 0 0 6px rgba(34, 211, 238, 0.6); }
    .badge-red {
      background: rgba(255, 8, 8, 0.1);
      color: #FF0808;
      border: 1px solid rgba(255, 8, 8, 0.2);
    }
    .badge-red .badge-dot { background: #FF0808; box-shadow: 0 0 6px rgba(255, 8, 8, 0.6); }
  `]
})
export class BadgeComponent {
  @Input() label = '';
  @Input() variant: 'success' | 'danger' | 'warning' | 'info' | 'red' = 'info';
  get variantClass(): string { return `badge-${this.variant}`; }
}
