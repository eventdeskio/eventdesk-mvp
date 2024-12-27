import { Component } from '@angular/core';
import { EventlistComponent } from '../../components/eventlist/eventlist.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-eventlistpage',
  imports: [EventlistComponent],
  templateUrl: './eventlistpage.component.html',
  styleUrl: './eventlistpage.component.css'
})
export class EventlistpageComponent {

  constructor(private router:Router){

  }
  
  goToGenerateEvent(){
    this.router.navigate(['/superadmin/events/generate']);

  }

}
