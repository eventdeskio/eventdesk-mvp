import { Routes } from '@angular/router';


export const HOST_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../Shared/layouts/host-layout/host-layout.component').then(
        (c) => c.HostLayoutComponent
      ),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./host-dashboard/host-dashboard.component').then(
            (c) => c.HostDashboardComponent
          ),
      },
      {
        path: 'events',
        loadComponent: () =>
          import('../Shared/pages/hosteventslistpage/hosteventslistpage.component').then(
            (c) => c.HosteventslistpageComponent
          ),
      },
      {
        path: 'events/preview/:id',
        loadComponent: () =>
          import('../Shared/pages/eventpreview/eventpreview.component').then(
            (c) => c.EventpreviewComponent
          ),
      },
      {
        path: 'vendors',
        loadComponent: () =>
          import('../Shared/pages/vendorlistpage/vendorlistpage.component').then(
            (c) => c.VendorlistpageComponent
          ),
      },
      
    ],
  },
];
