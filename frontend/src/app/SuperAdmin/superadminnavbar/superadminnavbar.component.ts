import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-superadminnavbar',
  imports: [CommonModule,RouterLink],
  templateUrl: './superadminnavbar.component.html',
  styleUrl: './superadminnavbar.component.css'
})
export class SuperadminnavbarComponent {

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
