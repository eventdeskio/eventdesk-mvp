import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventdetailsComponent } from '../../components/eventdetails/eventdetails.component';
import { EventrequirementComponent } from '../../components/eventrequirement/eventrequirement.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-eventpreview',
  imports: [CommonModule, EventdetailsComponent, EventrequirementComponent],
  templateUrl: './eventpreview.component.html',
  styleUrl: './eventpreview.component.css',
  standalone: true,
})
export class EventpreviewComponent implements OnInit {
  activeTab: string = 'details';
  eventId!: string; // Store the dynamic `id`
  userRole: any = null; // Initialize with null

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Fetch the `userRole` from `localStorage`
    if (typeof localStorage !== 'undefined') {
      this.userRole = localStorage.getItem('userRole');
    } else {
      console.error('localStorage is not available.');
    }

    // Fetch the `id` from the route
    this.route.paramMap.subscribe((params) => {
      this.eventId = params.get('id')!;
      console.log('Event ID:', this.eventId);
    });
  }
}
