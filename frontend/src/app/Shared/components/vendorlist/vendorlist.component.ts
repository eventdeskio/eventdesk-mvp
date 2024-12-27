import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserfetchService } from '../../../services/userfetch.service';

@Component({
  selector: 'app-vendorlist',
  imports: [CommonModule],
  templateUrl: './vendorlist.component.html',
  styleUrl: './vendorlist.component.css'
})
export class VendorlistComponent {

  vendorList:any;
  
    constructor(private userfetch:UserfetchService){
      this.fetchvendors();
    }
  
    async fetchvendors(){
      this.userfetch.fetchAllVendors().subscribe((response:any)=>{
        console.log(response);
        this.vendorList=response.data
  
      })
    }

}
