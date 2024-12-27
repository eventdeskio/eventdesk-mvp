import { Component,HostListener,OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EventlistComponent } from '../../Shared/components/eventlist/eventlist.component';
import { Router } from '@angular/router';
import { environment } from '../../../environment/environment';

@Component({
  selector: 'app-admin-dashboard',
  imports: [EventlistComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {

  events: any[] = []; // Array to store fetched events

  constructor(private http: HttpClient,private router:Router) {}

  ngOnInit(): void {
    this.http.get(`${environment.baseUrl}/events`).subscribe({
      next: (response) => console.log(response),
      error: (error) => console.error('Error:', error)
    });
    // Fetch events from the API
    this.http.get<any[]>(`${environment.baseUrl}/events`).subscribe({
      next: (response) => {
        this.events = response;
      },
      error: (error) => {
        console.error('Error fetching events:', error);
      }
    });
  }

  goToGenerateEvent(){
    console.log('')
    this.router.navigate(['superadmin/events/generate']);

  }

}
