import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserfetchService } from '../../../services/userfetch.service';

@Component({
  selector: 'app-adminlist',
  imports: [CommonModule],
  templateUrl: './adminlist.component.html',
  styleUrl: './adminlist.component.css'
})
export class AdminlistComponent {

  adminList: any;

  constructor(private userfetch: UserfetchService) {
    this.fetchAdmins();
  }

  async fetchAdmins() {
    this.userfetch.fetchAllAdmins().subscribe((response: any) => {
      console.log(response);
      this.adminList = response.data

    })
  }

}
