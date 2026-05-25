import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  template: `
    <button type="button" (click)="onClick.emit($event)" [disabled]="disabled" class="btn" [class]="variantClass">
      <ng-content></ng-content>
    </button>
  `,
  styles: [`
    .btn {
      display: inline-flex; align-items: center; justify-content: center; gap: 6px;
      padding: 8px 16px; border-radius: 8px; font-size: 12px; font-weight: 600;
      border: none; cursor: pointer; transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      white-space: nowrap; position: relative; overflow: hidden;
    }
    .btn::after {
      content: ''; position: absolute; inset: 0;
      background: linear-gradient(135deg, rgba(255,255,255,0.1), transparent);
      opacity: 0; transition: opacity 0.25s;
    }
    .btn:hover::after { opacity: 1; }
    .btn:active { transform: scale(0.97); }
    .btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }
    .btn:disabled::after { display: none; }
    .btn-primary {
      background: linear-gradient(135deg, #FF0808, #7A0202);
      color: #fff;
      box-shadow: 0 2px 12px rgba(255, 8, 8, 0.3);
    }
    .btn-primary:hover:not(:disabled) {
      box-shadow: 0 4px 20px rgba(255, 8, 8, 0.5);
      transform: translateY(-1px);
    }
    .btn-secondary {
      background: rgba(255, 8, 8, 0.1);
      color: #FF4444;
      border: 1px solid rgba(255, 8, 8, 0.15);
    }
    .btn-secondary:hover:not(:disabled) {
      background: rgba(255, 8, 8, 0.2);
      border-color: rgba(255, 8, 8, 0.3);
    }
    .btn-danger {
      background: rgba(239, 68, 68, 0.12);
      color: #fca5a5;
      border: 1px solid rgba(239, 68, 68, 0.2);
    }
    .btn-danger:hover:not(:disabled) {
      background: rgba(239, 68, 68, 0.25);
      border-color: rgba(239, 68, 68, 0.35);
    }
    .btn-success {
      background: rgba(34, 197, 94, 0.12);
      color: #86efac;
      border: 1px solid rgba(34, 197, 94, 0.2);
    }
    .btn-success:hover:not(:disabled) {
      background: rgba(34, 197, 94, 0.25);
      border-color: rgba(34, 197, 94, 0.35);
    }
  `]
})
export class ButtonComponent {
  @Input() variant: 'primary' | 'secondary' | 'danger' | 'success' = 'primary';
  @Input() disabled = false;
  @Output() onClick = new EventEmitter<Event>();
  get variantClass(): string { return `btn-${this.variant}`; }
}
