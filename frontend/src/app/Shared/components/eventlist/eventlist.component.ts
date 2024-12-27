import { Component, HostListener, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { environment } from '../../../../environment/environment';


@Component({
  selector: 'app-eventlist',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './eventlist.component.html',
  styleUrl: './eventlist.component.css'
})
export class EventlistComponent {

  events: any[] = []; // Array to store fetched events
  userRole: any = localStorage.getItem("userRole")

  constructor(private http: HttpClient, private router: Router) {

  }

  ngOnInit(): void {



    // Fetch events from the API
    this.http.get<any[]>(`${environment.baseUrl}/events`).subscribe({
      next: (response) => {
        console.log("role", this.userRole, history, localStorage.getItem("userId"))
        this.events = response;
      },
      error: (error) => {
        console.error('Error fetching events:', error);
      }
    });
  }

  deleteEvent(eventId: string, event: MouseEvent) {
    event.stopPropagation(); // Prevent event propagation to parent elements
    if (confirm('Are you sure you want to delete this event?')) {
      this.http
        .delete(`${environment.baseUrl}/events/${eventId}`)
        .subscribe(
          (response) => {
            console.log('Event deleted successfvaully:', response);
            // Remove the deleted event from the list
            this.events = this.events.filter((event) => event.id !== eventId);
          },
          (error) => {
            console.error('Error deleting event:', error);
            alert('Failed to delete the event. Please try again.');
          }
        );
    }
  }
  

  navigateToPreview(eventId: string): void {
    console.log("check", `${localStorage.getItem("userRole")?.toLowerCase()}/events/preview/${eventId}`)
    if (localStorage.getItem("userRole")?.toLowerCase() === "super_admin")
      this.router.navigate([`superadmin/events/preview/${eventId}`]);
    else
      this.router.navigate([`admin/events/preview/${eventId}`]);

  }

}
