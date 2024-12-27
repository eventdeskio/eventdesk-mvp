import { Component } from '@angular/core';
import { UserfetchService } from '../../../services/userfetch.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hostlist',
  imports: [CommonModule],
  templateUrl: './hostlist.component.html',
  styleUrl: './hostlist.component.css',
  standalone:true
})
export class HostlistComponent {

  hostList:any;

  constructor(private userfetch:UserfetchService){
    this.fetchHosts();
  }

  async fetchHosts(){
    this.userfetch.fetchAllHost().subscribe((response:any)=>{
      console.log(response);
      this.hostList=response.data

    })

  }

  

}
