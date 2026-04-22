import { Routes } from '@angular/router';

export const routes: Routes = [
 {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then(m => m.LoginPage)
  },  {
    path: 'report',
    loadComponent: () => import('./report/report.page').then( m => m.ReportPage)
  },
  {
    path: 'alerts',
    loadComponent: () => import('./alerts/alerts.page').then( m => m.AlertsPage)
  },


];
