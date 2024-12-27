import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserfetchService } from '../../../services/userfetch.service';

@Component({
  selector: 'app-companylist',
  imports: [CommonModule],
  templateUrl: './companylist.component.html',
  styleUrl: './companylist.component.css'
})
export class CompanylistComponent {

  adminList:any;
    
      constructor(private userfetch:UserfetchService){
        this.fetchAdmins();
      }
    
      async fetchAdmins(){
        this.userfetch.fetchAllCompanies().subscribe((response:any)=>{
          console.log(response);
          this.adminList=response.data
    
        })
      }
  

}
