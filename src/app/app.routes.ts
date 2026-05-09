import { Routes } from '@angular/router';

export const routes: Routes = [
  
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
  path: 'profile',
  loadComponent: () =>
    import('./profile/profile.page').then(m => m.ProfilePage)
},
  {
    path: 'login',
    loadComponent: () =>
      import('./login/login.page').then(m => m.LoginPage)
  },
   {
    path: 'tabs',
    loadChildren: () =>
      import('./tabs/tabs.routes').then(m => m.routes)
  },

  // {
  //   path: 'tabs',
  //   loadChildren: () => import('./tabs/tabs.routes').then(m => m.routes),
  // },

  // {
  //   path: 'login',
  //   loadComponent: () => import('./login/login.page').then(m => m.LoginPage)
  // },
  
 {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'report',
    loadComponent: () => import('./report/report.page').then( m => m.ReportPage)
  },
  {
    path: 'alerts',
    loadComponent: () => import('./alerts/alerts.page').then( m => m.AlertsPage)
  },


];
