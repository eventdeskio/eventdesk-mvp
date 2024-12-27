import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { VendornavbarComponent } from '../../../Vendors/vendornavbar/vendornavbar.component';

@Component({
  selector: 'app-vendor-layout',
  imports:[RouterOutlet,VendornavbarComponent],
  templateUrl: './vendor-layout.component.html',
  styleUrl: './vendor-layout.component.css'
})
export class VendorLayoutComponent {

}
