import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VendorlistComponent } from '../../components/vendorlist/vendorlist.component';

@Component({
  selector: 'app-vendorlistpage',
  imports: [VendorlistComponent,CommonModule],
  templateUrl: './vendorlistpage.component.html',
  styleUrl: './vendorlistpage.component.css'
})
export class VendorlistpageComponent {

}
