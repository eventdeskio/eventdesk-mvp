import { CommonModule } from '@angular/common';
import { Component,HostListener,OnInit } from '@angular/core';
import { HosteventslistComponent } from '../../Shared/components/hosteventslist/hosteventslist.component';



@Component({
  selector: 'app-host-dashboard',
  imports: [CommonModule,HosteventslistComponent],
  templateUrl: './host-dashboard.component.html',
  styleUrl: './host-dashboard.component.css'
})
export class HostDashboardComponent {

}
