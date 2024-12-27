import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink,Router } from '@angular/router';


@Component({
  selector: 'app-vendornavbar',
  imports:  [CommonModule,RouterLink],
  templateUrl: './vendornavbar.component.html',
  styleUrl: './vendornavbar.component.css'
})
export class VendornavbarComponent {

  selectedNav: string = 'home'; // Default selected nav item

  constructor(private router:Router){}
  
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