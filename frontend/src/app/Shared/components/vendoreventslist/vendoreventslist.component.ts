import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../../../environment/environment';

@Component({
  selector: 'app-vendoreventslist',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vendoreventslist.component.html',
  styleUrls: ['./vendoreventslist.component.css'],
})
export class VendoreventslistComponent implements OnInit {
  events: any[] = []; // Array to store fetched events
  host_id: string | null = localStorage.getItem('userId');

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    if (!this.host_id) {
      console.error('Host ID not found in local storage');
      
      return;
    }

    this.fetchVendorEvents();

    console.log(`${localStorage.getItem("userRole")?.toLowerCase()}/preview/}`)

  }

  // Fetch vendor-related events and process them
  private fetchVendorEvents(): void {
    this.http
      .post<any[]>(`${environment.baseUrl}/vendors/withvendorid`, {
        host_id: this.host_id,
      })
      .subscribe({
        next: async (response: any) => {
          const processedData = this.groupVendorServices(response.event);
          this.events = await this.makeEventsReady(processedData);
          // console.log("this.events",localStorage.getItem("userRole")?.toLowerCase()+`/preview/eventId)
        },
        error: (error) => {
          console.error('Error fetching events:', error);
        },
      });
  }

  // Group vendor services under their respective events
  private groupVendorServices(events: any[]): any[] {
    return events.reduce((acc: any[], curr: any) => {
      // Find or initialize the event
      let event = acc.find((e: any) => e.event_id === curr.event_id);
      if (!event) {
        event = { event_id: curr.event_id, vendors: [] };
        acc.push(event);
      }

      // Find or initialize the vendor
      let vendor = event.vendors.find((v: any) => v.vendor_id === curr.vendor_id);
      if (!vendor) {
        vendor = { vendor_id: curr.vendor_id, services: [] };
        event.vendors.push(vendor);
      }

      // Add the service to the vendor
      if (!vendor.services.includes(curr.service)) {
        vendor.services.push(curr.service);
      }

      return acc;
    }, []);
  }

  // Fetch additional event details and enrich data
  private async makeEventsReady(processedData: any[]): Promise<any[]> {
    let i=-1;
    return Promise.all(
      processedData.map(async (pData: any) => {
        try {
          const eventDetails:any = await lastValueFrom(
            this.http.get(`${environment.baseUrl}/events?id=${pData.event_id}`)
          );
      
          i++;
          return {
            ...eventDetails[i], // Include event details from API
            service: pData.vendors[0].services, // Add vendor services grouped from processed data
          };
        } catch (error) {
          console.error(`Failed to fetch details for event ID: ${pData.event_id}`, error);
          return {
            event_id: pData.event_id,
            vendors: pData.vendors,
            error: 'Failed to fetch event details',
          }; // Return a partial object if an API call fails
        }
      })
    );
  }

  // Navigate to the preview page for the selected event
  navigateToPreview(eventId: string): void {
    this.router.navigate([`${localStorage.getItem("userRole")?.toLowerCase()}/events/preview/${eventId}`]);
  }
}
