import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SuperadminnavbarComponent } from '../../../SuperAdmin/superadminnavbar/superadminnavbar.component';

@Component({
  standalone: true,
  selector: 'app-superadmin-layout',
  imports:[RouterOutlet,SuperadminnavbarComponent],
  templateUrl: './superadmin-layout.component.html',
  styleUrls: ['./superadmin-layout.component.css'],
})
export class SuperAdminLayoutComponent {}
