import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hostnavbar',
  imports: [CommonModule,RouterLink],
  templateUrl: './hostnavbar.component.html',
  styleUrl: './hostnavbar.component.css'
})
export class HostnavbarComponent {

  selectedNav: string = 'home'; // Default selected nav item

  constructor(private router : Router){
    
  }

  selectNav(nav: string) {
    this.selectedNav = nav; // Change the active nav
  }


  logout() {
    // Clear local storage
    localStorage.clear();

    // Navigate to the login page and replace the URL
    this.router.navigate(['/login'], { replaceUrl: true });
  }

}
