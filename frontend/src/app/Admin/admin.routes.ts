import { Routes } from '@angular/router';
import { EventgenerationComponent } from '../Shared/pages/eventgeneration/eventgeneration.component';
import { EventpreviewComponent } from '../Shared/pages/eventpreview/eventpreview.component';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../Shared/layouts/admin-layout/admin-layout.component').then(
        (c) => c.AdminLayoutComponent
      ),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./admin-dashboard/admin-dashboard.component').then(
            (c) => c.AdminDashboardComponent
          ),
      },
      {
        path: 'events/generate',
        loadComponent: () =>
          import('../Shared/pages/eventgeneration/eventgeneration.component').then(
            (c) => c.EventgenerationComponent
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
        path: 'events',
        loadComponent: () =>
          import('../Shared/pages/eventlistpage/eventlistpage.component').then(
            (c) => c.EventlistpageComponent
          ),
        // children: [
          
        // ],
      },
      
      {
        path: 'hosts',
        loadComponent: () =>
          import('../Shared/pages/hostlistpage/hostlistpage.component').then(
            (c) => c.HostlistpageComponent
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
