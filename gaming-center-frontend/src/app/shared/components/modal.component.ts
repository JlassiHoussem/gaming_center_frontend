import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="isOpen" class="modal-backdrop" (click)="onBackdropClick($event)">
      <div class="modal">
        <div class="modal-header">
          <h3 class="modal-title">{{ title }}</h3>
          <button (click)="close()" class="modal-close">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <div class="modal-body"><ng-content></ng-content></div>
      </div>
    </div>
  `,
  styles: [`
    .modal-backdrop {
      position: fixed; inset: 0;
      background: rgba(0, 0, 0, 0.75);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      display: flex; align-items: center; justify-content: center;
      z-index: 1000;
      animation: fadeIn 0.25s ease-out;
    }
    .modal {
      background: rgba(15, 10, 30, 0.95);
      backdrop-filter: blur(24px);
      border: 1px solid rgba(139, 92, 246, 0.2);
      border-radius: 16px;
      width: 100%; max-width: 440px; margin: 0 16px;
      animation: slideUp 0.35s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 24px 48px rgba(0, 0, 0, 0.4), 0 0 32px rgba(139, 92, 246, 0.08);
    }
    .modal-header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 16px 20px;
      border-bottom: 1px solid rgba(139, 92, 246, 0.1);
    }
    .modal-title {
      font-size: 14px; font-weight: 700; margin: 0;
      background: linear-gradient(135deg, #06B6D4, #8B5CF6);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .modal-close {
      background: rgba(139, 92, 246, 0.1); border: none; color: #6b7280;
      cursor: pointer; padding: 6px; border-radius: 6px;
      transition: all 0.2s; display: flex; align-items: center; justify-content: center;
    }
    .modal-close:hover { background: rgba(139, 92, 246, 0.2); color: #e2e8f0; }
    .modal-body { padding: 20px; }
  `]
})
export class ModalComponent {
  @Input() isOpen = false;
  @Input() title = '';
  @Output() closed = new EventEmitter<void>();
  close() { this.closed.emit(); }
  onBackdropClick(event: MouseEvent) { if (event.target === event.currentTarget) { this.close(); } }
}
