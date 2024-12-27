import { Component,HostListener,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VendoreventslistComponent } from '../../Shared/components/vendoreventslist/vendoreventslist.component';


@Component({
  selector: 'app-vendor-dashboard',
  imports: [CommonModule,VendoreventslistComponent],
  templateUrl: './vendor-dashboard.component.html',
  styleUrl: './vendor-dashboard.component.css'
})
export class VendorDashboardComponent {

}
