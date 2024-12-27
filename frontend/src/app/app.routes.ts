import { Routes } from '@angular/router';

import { SignupComponent } from './signup/signup.component';
import { SigninComponent } from './signin/signin.component';
import { AdminDashboardComponent } from './Admin/admin-dashboard/admin-dashboard.component';
import { VendorDashboardComponent } from './Vendors/vendor-dashboard/vendor-dashboard.component';
import { HostDashboardComponent } from './Hosts/host-dashboard/host-dashboard.component';
import { SuperadminDashboardComponent } from './SuperAdmin/superadmin-dashboard/superadmin-dashboard.component';
import { EventgenerationComponent } from './Shared/pages/eventgeneration/eventgeneration.component';
import { EventpreviewComponent } from './Shared/pages/eventpreview/eventpreview.component';
import { VendorlistpageComponent } from './Shared/pages/vendorlistpage/vendorlistpage.component';
import { HostlistpageComponent } from './Shared/pages/hostlistpage/hostlistpage.component';
import { EventlistpageComponent } from './Shared/pages/eventlistpage/eventlistpage.component';
import { CompanysignupComponent } from './Shared/components/companysignup/companysignup.component';

export const routes: Routes = [
  // Public Routes
  { path: '', component: SigninComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'companysignup', component: CompanysignupComponent },


  // Vendor Routes
  // {
  //   path: 'vendor',
  //   children: [
  //     { path: 'dashboard', component: VendorDashboardComponent },
  //     {
  //       path: 'events',
  //       component: EventlistpageComponent,
  //     }
  //   ],
  // },
  
  {
    path: 'vendor',
    loadChildren: () => import('./Vendors/vendor.routes').then(m => m.VENDOR_ROUTES),
    // canActivate: [AuthGuard],
  },

  // Admin Routes
  // {
  //   path: 'admin',
  //   children: [
  //     { path: 'dashboard', component: AdminDashboardComponent },
  //     {
  //       path: 'events',
  //       component: EventlistpageComponent,
  //     },
  //     {
  //       path: 'events/generate',
  //       component: EventgenerationComponent,
  //     },
  //     {
  //       path: 'events/preview/:id', // Move this route out of the children array
  //       component: EventpreviewComponent,
  //     },
  //     { path: 'vendors', component: VendorlistpageComponent },
  //     { path: 'hosts', component: HostlistpageComponent },
  //   ],
  // },

  {
    path: 'admin',
    loadChildren: () => import('./Admin/admin.routes').then(m => m.ADMIN_ROUTES),
    // canActivate: [AuthGuard],
  },
  
  

  // Host Routes
  // {
  //   path: 'host',
  //   children: [
  //     { path: 'dashboard', component: HostDashboardComponent },
  //     {
  //       path: 'events',
  //       component: EventlistpageComponent,
  //     },
  //   ],
    
  // },

  {
    path: 'host',
    loadChildren: () => import('./Hosts/host.routes').then(m => m.HOST_ROUTES),
    // canActivate: [AuthGuard],
  },

  // Superadmin Routes
  // {
  //   path: 'superadmin',
  //   children: [
  //     { path: 'dashboard', component: SuperadminDashboardComponent },
  //     {
  //       path: 'events',
  //       component: EventlistpageComponent,
  //     },
  //     {
  //       path: 'events/preview/:id', // Move this route out of the children array
  //       component: EventpreviewComponent,
  //     },
  //     { path: 'vendors', component: VendorlistpageComponent },
  //     { path: 'hosts', component: HostlistpageComponent },

  //   ],
  // },

  {
    path: 'superadmin',
    loadChildren: () => import('./SuperAdmin/superadmin.routes').then(m => m.SUPERADMIN_ROUTES),
    // canActivate: [AuthGuard],
  },

  // Event Routes
  {
    path: 'event',
    children: [
      { path: 'generate', component: EventgenerationComponent },
      { path: 'preview', component: EventpreviewComponent },
    ],
  },

  // Fallback Route
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
