import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HostnavbarComponent } from '../../../Hosts/hostnavbar/hostnavbar.component';

@Component({
  selector: 'app-host-layout',
  imports:[RouterOutlet,HostnavbarComponent],
  templateUrl: './host-layout.component.html',
  styleUrl: './host-layout.component.css'
})
export class HostLayoutComponent {

}



