import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('../dashboard/dashboard.page').then((m) => m.DashboardPage),
      },
      {
        path: 'my-vehicle',
        loadComponent: () =>
          import('../my-vehicle/my-vehicle.page').then((m) => m.MyVehiclePage),
      },
      {
        path: 'tracking',
        loadComponent: () =>
          import('../tracking/tracking.page').then((m) => m.TrackingPage),
      },
      {
        path: 'history',
        loadComponent: () =>
          import('./history/history.page').then((m) => m.HistoryPage),
      },
      {
        path: '',
        redirectTo: '/tabs/dashboard',
        pathMatch: 'full',
      },
    ],
  },
{
  path: 'profile',
  loadComponent: () =>
    import('../profile/profile.page').then((m) => m.ProfilePage),
},

  {
    path: '',
    redirectTo: '/tabs/dashboard',
    pathMatch: 'full',
  },
  
];
