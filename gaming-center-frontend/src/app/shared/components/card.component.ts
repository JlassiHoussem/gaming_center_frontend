import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-card',
  standalone: true,
  template: `
    <div class="card" (click)="onClick.emit($event)">
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    .card {
      position: relative;
      background: rgba(5, 2, 8, 0.9);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 8, 8, 0.15);
      border-radius: 14px;
      padding: 18px;
      transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
      overflow: hidden;
    }
    .card::before {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 14px;
      padding: 1px;
      background: linear-gradient(135deg, rgba(255, 8, 8, 0.25), transparent 50%, rgba(6, 182, 212, 0.15));
      -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
      opacity: 0.6;
      transition: opacity 0.35s;
      pointer-events: none;
    }
    .card::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(255, 8, 8, 0.3), transparent);
      pointer-events: none;
    }
    .card:hover {
      transform: translateY(-4px);
      border-color: rgba(255, 8, 8, 0.3);
      box-shadow: 0 8px 32px rgba(255, 8, 8, 0.15), 0 2px 8px rgba(0, 0, 0, 0.3);
    }
    .card:hover::before { opacity: 1; }
  `]
})
export class CardComponent {
  @Input() title = '';
  @Output() onClick = new EventEmitter<MouseEvent>();
}
