import { Component, Input, OnInit } from '@angular/core';
import { UserfetchService } from '../../../services/userfetch.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-eventdetails',
  templateUrl: './eventdetails.component.html',
  styleUrls: ['./eventdetails.component.css'],
  imports:[CommonModule],
  standalone: true
})
export class EventdetailsComponent implements OnInit{
  @Input() event_id: string;


  eventName: any;
  eventDescription: any;
  eventBudget: any;
  eventCategory: any;
  eventStartDate: any;
  eventEndDate: any;
  hosts: any[] = [];
  vendors: any[] = [];
  hostInfo: any[] = [];
  vendorInfo: any[] = [];
  isLoading = true;
  adminInfo:any;

  

  constructor(private userFetchService: UserfetchService) {
    
  }

  ngOnInit(): void {

    console.log("eventId",this.event_id)
    this.initializeData();
      
  }
  async initializeData() {
    try {
      // Fetch event details
      
      const eventDetails = await this.userFetchService
        .fetchEventDetails(this.event_id)
        .toPromise();
      console.log('Event details fetched:', eventDetails);

      // Set event details
      this.eventName = eventDetails.title;
      this.eventDescription = eventDetails.description;
      this.eventBudget = eventDetails.total_budget;
      this.eventCategory = eventDetails.category;
      this.eventStartDate = eventDetails.start_date;
      this.eventEndDate = eventDetails.end_date;
      this.hosts = eventDetails.hosts;
      this.vendors = eventDetails.vendors;

      await this.fetchAdminInfo();
      console.log('admin fetched:', this.adminInfo);

      // Fetch hosts and vendors sequentially
      await this.fetchHosts(this.hosts);
      console.log('Hosts fetched:', this.hostInfo);

      await this.fetchVendors(this.vendors);
      console.log('Vendors fetched:', this.vendorInfo);

      console.log('All operations completed in sequence.');
    } catch (error) {
      console.error('Error during initialization:', error);
    } finally {
      this.isLoading = false;
    }
  }

  async fetchHosts(hosts: string[]) {
    try {
      const hostRequests = this.userFetchService.fetchHosts(hosts);
      this.hostInfo = await Promise.all(hostRequests.map(req => req.toPromise()));
    } catch (error) {
      console.error('Error fetching hosts:', error);
      throw error;
    }
    
  }

  async fetchVendors(vendors: string[]) {
    try {
      const vendorRequests = this.userFetchService.fetchVendors(vendors);
      this.vendorInfo = await Promise.all(vendorRequests.map(req => req.toPromise()));
      console.log("vendor info",this.vendorInfo)
    } catch (error) {
      console.error('Error fetching vendors:', error);
      throw error;
    }
  }

  async fetchAdminInfo() {
    try {
      // Get adminId from localStorage
      const adminId = localStorage.getItem("userId");
  
      // Ensure adminId is available before making the API call
      if (!adminId) {
        throw new Error("Admin ID not found in localStorage");
      }
  
      // Fetch admin info from the service and wait for the response
      const response = await this.userFetchService.fetchAdminWithId(adminId).toPromise();
      
      // Store the fetched admin info
      this.adminInfo = response;
      
      console.log("admin info", this.adminInfo);
    } catch (error) {
      console.error('Error fetching admin info:', error);
      throw error;
    }
  }
  
  
}
