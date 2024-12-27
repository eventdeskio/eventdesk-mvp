import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HostlistComponent } from '../../components/hostlist/hostlist.component';


@Component({
  selector: 'app-hostlistpage',
  imports: [CommonModule,HostlistComponent],
  templateUrl: './hostlistpage.component.html',
  styleUrl: './hostlistpage.component.css'
})
export class HostlistpageComponent {

}
