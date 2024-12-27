import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HosteventslistComponent } from '../../components/hosteventslist/hosteventslist.component';

@Component({
  selector: 'app-hosteventslistpage',
  imports: [CommonModule,HosteventslistComponent],
  templateUrl: './hosteventslistpage.component.html',
  styleUrl: './hosteventslistpage.component.css'
})
export class HosteventslistpageComponent {

}
