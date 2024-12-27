import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VendoreventslistComponent } from '../../components/vendoreventslist/vendoreventslist.component';

@Component({
  selector: 'app-vendoreventslistpage',
  imports: [CommonModule,VendoreventslistComponent],
  templateUrl: './vendoreventslistpage.component.html',
  styleUrl: './vendoreventslistpage.component.css'
})
export class VendoreventslistpageComponent {

}
