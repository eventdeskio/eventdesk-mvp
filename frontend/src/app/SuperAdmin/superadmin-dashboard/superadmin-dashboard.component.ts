import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanylistComponent } from '../../Shared/components/companylist/companylist.component';
import { CompanysignupComponent } from '../../Shared/components/companysignup/companysignup.component';
import { AdminlistComponent } from '../../Shared/components/adminlist/adminlist.component';

@Component({
  selector: 'app-superadmin-dashboard',
  imports: [CommonModule,AdminlistComponent,CompanylistComponent,CompanysignupComponent],
  templateUrl: './superadmin-dashboard.component.html',
  styleUrl: './superadmin-dashboard.component.css'
})
export class SuperadminDashboardComponent {

  showSignupModal = false;

  openSignupModal() {
    this.showSignupModal = true;
  }

  closeSignupModal() {
    this.showSignupModal = false;
  }

}
