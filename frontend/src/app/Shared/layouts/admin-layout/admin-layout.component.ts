import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AdminnavbarComponent } from '../../../Admin/adminnavbar/adminnavbar.component';

@Component({
  selector: 'app-admin-layout',
  imports:[RouterOutlet,AdminnavbarComponent],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css'
})
export class AdminLayoutComponent {

}


