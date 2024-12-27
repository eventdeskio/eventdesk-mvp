import { Routes } from '@angular/router';


export const VENDOR_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../Shared/layouts/vendor-layout/vendor-layout.component').then(
        (c) => c.VendorLayoutComponent
      ),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./vendor-dashboard/vendor-dashboard.component').then(
            (c) => c.VendorDashboardComponent
          ),
      },
      {
        path: 'events',
        loadComponent: () =>
          import('../Shared/pages/vendoreventslistpage/vendoreventslistpage.component').then(
            (c) => c.VendoreventslistpageComponent
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
        path: 'invites',
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
