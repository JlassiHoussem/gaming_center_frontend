import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadChildren: () => import('./features/dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES)
      },
      {
        path: 'appareils',
        loadChildren: () => import('./features/appareils/appareils.routes').then(m => m.APPAREILS_ROUTES)
      },
      {
        path: 'buffet',
        loadChildren: () => import('./features/buffet/buffet.routes').then(m => m.BUFFET_ROUTES)
      },
      {
        path: 'depenses',
        loadChildren: () => import('./features/depenses/depenses.routes').then(m => m.DEPENSES_ROUTES)
      },
      // {
      //   path: 'shifts',
      //   loadChildren: () => import('./features/shifts/shifts.routes').then(m => m.SHIFTS_ROUTES)
      // },
      {
        path: 'rapports',
        loadChildren: () => import('./features/rapports/rapports.routes').then(m => m.RAPPORTS_ROUTES)
      },
      {
        path: 'parametres',
        loadChildren: () => import('./features/parametres/parametres.routes').then(m => m.PARAMETRES_ROUTES)
      }
    ]
  },
  { path: '**', redirectTo: 'dashboard' }
];
