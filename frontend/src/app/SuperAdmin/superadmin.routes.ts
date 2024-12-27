import { Routes } from '@angular/router';
import { AdminnavbarComponent } from '../Admin/adminnavbar/adminnavbar.component';
// import { RoleGuard } from '../../core/auth/role.guard';


export const SUPERADMIN_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../Shared/layouts/superadmin-layout/superadmin-layout.component').then(
        (c) => c.SuperAdminLayoutComponent
      ),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./superadmin-dashboard/superadmin-dashboard.component').then(
            (c) => c.SuperadminDashboardComponent
          ),
      },
      {
        path: 'events',
        loadComponent: () =>
          import('../Shared/pages/eventlistpage/eventlistpage.component').then(
            (c) => c.EventlistpageComponent
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
