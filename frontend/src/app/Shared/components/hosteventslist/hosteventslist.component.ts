import { Component,HostListener,OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { environment } from '../../../../environment/environment';

@Component({
  selector: 'app-hosteventslist',
  imports: [CommonModule],
  templateUrl: './hosteventslist.component.html',
  styleUrl: './hosteventslist.component.css'
})
export class HosteventslistComponent {

  
    events: any[] = []; // Array to store fetched events

    host_id:any=localStorage.getItem("userId");
    
    constructor(private http: HttpClient,private router:Router) {}
  
    ngOnInit(): void {
      
      // Fetch events from the API
      this.http.post<any[]>(`${environment.baseUrl}/events/hostEvents`,{host_id:this.host_id}).subscribe({
        next: (response:any) => {
          this.events = response.events;
        },
        error: (error) => {
          console.error('Error fetching events:', error);
        }
      });
    }
  
    navigateToPreview(eventId: string): void {
      this.router.navigate([`host/events/preview/${eventId}`]);
    }

}
