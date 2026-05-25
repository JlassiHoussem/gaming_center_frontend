import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <div class="bg-animated"><div class="bg-blob-3"></div></div>
    <div class="app-container">
      <aside class="sidebar">
        <div class="sidebar-bg-img" style="background-image: url('gaming-device.jpg')"></div>
        <div class="sidebar-glow-edge"></div>
        <div class="sidebar-header">
          <div class="logo-wrapper">
            <div class="logo-icon">
              <img src="hammer.png" alt="Gaming Center" class="logo-img" />
            </div>
            <div class="logo-text">
              <span class="logo-title">GAMING CENTER</span>
              <span class="logo-subtitle">Management System</span>
            </div>
          </div>
        </div>
        <nav class="sidebar-nav">
          <a routerLink="/dashboard" routerLinkActive="active" class="nav-item">
            <div class="nav-icon-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
            </div>
            <span>Dashboard</span>
            <div class="nav-active-line"></div>
          </a>
          <a routerLink="/appareils" routerLinkActive="active" class="nav-item">
            <div class="nav-icon-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
            </div>
            <span>Appareils</span>
            <div class="nav-active-line"></div>
          </a>
          <a routerLink="/buffet" routerLinkActive="active" class="nav-item">
            <div class="nav-icon-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8zM6 1v3M10 1v3M14 1v3"/></svg>
            </div>
            <span>Buffet</span>
            <div class="nav-active-line"></div>
          </a>
          <a routerLink="/depenses" routerLinkActive="active" class="nav-item">
            <div class="nav-icon-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
            <span>Dépenses</span>
            <div class="nav-active-line"></div>
          </a>
          <!--a routerLink="/shifts" routerLinkActive="active" class="nav-item">
            <div class="nav-icon-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>
            </div>
            <span>Shifts</span>
            <div class="nav-active-line"></div>
          </a-->
          <a routerLink="/rapports" routerLinkActive="active" class="nav-item">
            <div class="nav-icon-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
            </div>
            <span>Rapports</span>
            <div class="nav-active-line"></div>
          </a>
          <a routerLink="/parametres" routerLinkActive="active" class="nav-item">
            <div class="nav-icon-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><circle cx="12" cy="12" r="3"/></svg>
            </div>
            <span>Paramètres</span>
            <div class="nav-active-line"></div>
          </a>
        </nav>
        <div class="sidebar-footer">
          <div class="status-dot"></div>
          <span class="status-text">Système actif</span>
          <div class="footer-glow"></div>
        </div>
        <div class="sidebar-scanline"></div>
      </aside>
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    :host { display: block; height: 100vh; }
    .app-container { display: flex; height: 100vh; position: relative; z-index: 1; }
    .sidebar {
      width: 240px;
      background: rgba(11, 14, 19, 0.9);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border-right: 1px solid rgba(255, 8, 8, 0.1);
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
      animation: slideIn 0.5s ease-out;
      position: relative;
      overflow: hidden;
    }
    .sidebar-bg-img {
      position: absolute;
      inset: 0;
      background-size: cover;
      background-position: center;
      opacity: 0.06;
      z-index: 0;
      pointer-events: none;
    }
    .sidebar-glow-edge {
      position: absolute;
      right: 0;
      top: 0;
      bottom: 0;
      width: 1px;
      background: linear-gradient(to bottom, transparent, rgba(255, 8, 8, 0.3), rgba(255, 8, 8, 0.4), rgba(139, 92, 246, 0.3), transparent);
    }
    .sidebar-scanline {
      position: absolute;
      inset: 0;
      background: repeating-linear-gradient(
        0deg,
        transparent,
        transparent 2px,
        rgba(255, 8, 8, 0.015) 2px,
        rgba(255, 8, 8, 0.015) 4px
      );
      pointer-events: none;
      z-index: 0;
    }
    .sidebar-header { padding: 20px 16px; border-bottom: 1px solid rgba(255, 8, 8, 0.08); position: relative; z-index: 1; }
    .logo-wrapper { display: flex; align-items: center; gap: 12px; }
    .logo-icon {
      width: 38px; height: 38px;
      background: linear-gradient(135deg, rgba(255, 8, 8, 0.15), rgba(122, 2, 2, 0.15));
      border-radius: 10px;
      display: flex; align-items: center; justify-content: center;
      border: 1px solid rgba(255, 8, 8, 0.2);
      box-shadow: 0 0 15px rgba(255, 8, 8, 0.05);
      overflow: hidden;
    }
    .logo-img { width: 24px; height: 24px; object-fit: contain; filter: brightness(0) invert(1); opacity: 0.9; }
    .logo-text { display: flex; flex-direction: column; }
    .logo-title {
      font-size: 12px; font-weight: 700;
      letter-spacing: 2px;
      color: #FFF;
      font-family: 'Chakra Petch', sans-serif;
    }
    .logo-subtitle { font-size: 9px; color: #6b7280; letter-spacing: 0.5px; margin-top: 1px; }
    .sidebar-nav { flex: 1; padding: 12px 10px; display: flex; flex-direction: column; gap: 2px; position: relative; z-index: 1; }
    .nav-item {
      display: flex; align-items: center; gap: 10px;
      padding: 10px 12px; border-radius: 8px;
      color: #ABABAB; text-decoration: none;
      font-size: 12.5px; font-weight: 600;
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative; overflow: hidden;
    }
    .nav-item::before {
      content: ''; position: absolute; inset: 0;
      background: linear-gradient(135deg, rgba(255, 8, 8, 0.08), rgba(122, 2, 2, 0.08));
      opacity: 0; transition: opacity 0.25s;
      border-radius: 8px;
    }
    .nav-item:hover { color: #FFF; }
    .nav-item:hover::before { opacity: 1; }
    .nav-item:active { transform: scale(0.97); }
    .nav-item.active {
      color: #FF0808;
      background: rgba(255, 8, 8, 0.08);
    }
    .nav-item.active .nav-icon-wrap {
      color: #FF0808;
      background: rgba(255, 8, 8, 0.1);
    }
    .nav-item.active .nav-icon-wrap svg { filter: drop-shadow(0 0 6px rgba(255, 8, 8, 0.5)); }
    .nav-item.active .nav-active-line { opacity: 1; transform: scaleY(1); }
    .nav-icon-wrap {
      width: 28px; height: 28px;
      display: flex; align-items: center; justify-content: center;
      border-radius: 6px; flex-shrink: 0;
      transition: all 0.25s;
    }
    .nav-icon-wrap svg { width: 15px; height: 15px; }
    .nav-active-line {
      position: absolute; left: 0; top: 50%; transform: translateY(-50%) scaleY(0);
      width: 2px; height: 20px;
      background: linear-gradient(to bottom, #FF0808, #FF4444);
      border-radius: 1px; opacity: 0;
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 0 8px rgba(255, 8, 8, 0.4);
    }
    .sidebar-footer {
      padding: 14px 16px;
      border-top: 1px solid rgba(255, 8, 8, 0.08);
      display: flex; align-items: center; gap: 8px;
      position: relative; z-index: 1;
    }
    .sidebar-footer .footer-glow {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 1px;
      background: linear-gradient(to right, transparent, rgba(74, 222, 128, 0.3), transparent);
    }
    .status-dot {
      width: 6px; height: 6px; border-radius: 50%;
      background: #4ade80;
      box-shadow: 0 0 8px rgba(74, 222, 128, 0.6);
      animation: breathe 2s ease-in-out infinite;
    }
    .status-text { font-size: 10px; color: #6b7280; letter-spacing: 0.5px; }
    .main-content {
      flex: 1; overflow: auto; padding: 28px;
      animation: fadeIn 0.6s ease-out;
    }
    .main-content::-webkit-scrollbar { width: 6px; }
    .main-content::-webkit-scrollbar-track { background: transparent; }
    .main-content::-webkit-scrollbar-thumb { background: rgba(255, 8, 8, 0.2); border-radius: 3px; }
    .main-content::-webkit-scrollbar-thumb:hover { background: rgba(255, 8, 8, 0.4); }
  `]
})
export class LayoutComponent {}
