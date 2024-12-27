import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormArray } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { jwtDecode } from 'jwt-decode';
import { CommonModule } from '@angular/common';
import { switchMap } from 'rxjs/operators';
import { environment } from '../../../../environment/environment';
import { Router } from '@angular/router';




@Component({
  selector: 'app-eventgeneration',
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './eventgeneration.component.html',
  styleUrl: './eventgeneration.component.css'
})

export class EventgenerationComponent implements OnInit {
  createEventForm!: FormGroup;
  hostsList: { email: string }[] = []; // Array to store hosts
  vendorsList: { email: string }[] = [];
  requirementsList: { requirement: string, vendor_id: string }[] = []; // Array for requirements
  vendors: any[] = [];
  hosts: any[] = [];
  authToken: string = '';
  company_id: string = '';
  admin_id: string = '';
  categories = [
    'Anniversary',
    'Award Functions',
    'Baby Shower',
    'Birthday',
    'Charity Event',
    'Concert',
    'Conference',
    'Corporate Event',
    'Engagement Ceremony',
    'Exhibition',
    'Farewell Party',
    'Festival',
    'Marriage',
    'Networking Event',
    'Others',
    'Product Launch',
    'Retreat',
    'Seminar',
    'Sports Event',
    'Team Building',
    'Trade Show',
    'Wedding Reception',
    'Workshop'
  ];


  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    // Basic form initialization
    this.createEventForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
      total_budget: ['', Validators.required],
      category: ['', Validators.required],
    });

    this.fetchInitialData();
  }

  fetchInitialData(): void {
    this.authToken = localStorage.getItem('authToken') || '';
    const decodedToken: any = jwtDecode(this.authToken);
    this.company_id = decodedToken.company_id;
    this.admin_id = decodedToken.admin_id;

    // Fetch vendors (assuming API endpoint)
    this.http.get<{ data: any[] }>(`${environment.baseUrl}/users/getallvendors`).subscribe(
      (response) => (this.vendors = response.data)
    );

    this.http.get<{ data: any[] }>(`${environment.baseUrl}/users/getallhosts`).subscribe(
      (response) => (this.hosts = response.data)
    );
  }

  // Add host input to array
  addHost(): void {
    this.hostsList.push({ email: '' });
  }

  removeHost(index: number): void {
    this.hostsList.splice(index, 1);
  }

  // Add requirement input to array
  addRequirement(): void {
    this.requirementsList.push({ requirement: '', vendor_id: '' });
  }

  removeRequirement(index: number): void {
    this.requirementsList.splice(index, 1);
  }

  onClose(): void {
    console.log('Registration Cancelled');
    if (localStorage.getItem("userRole")?.toLowerCase() === "super_admin")
      this.router.navigate(['superadmin/events']);
    else
      this.router.navigate(['admin/events']);
  }


  // Submit handler
  async onSubmit(): Promise<void> {

    const vendors = this.requirementsList.map(req => req.vendor_id);

    this.http.post<any>(`${environment.baseUrl}/admin/getcompanyid`, { admin_id: localStorage.getItem('userId') }).subscribe(
      (response) => {
        localStorage.setItem("companyId", response.data)
      }
    )

    // if (this.createEventForm.invalid) return;

    const formData = {
      ...this.createEventForm.value,
      company_id: localStorage.getItem("companyId"),
      admin_id: localStorage.getItem('userId'),
      hosts: this.hostsList.map(host => host.email),
      requirements: this.requirementsList,
      vendors: vendors
    };

    console.log("hey there", this.createEventForm, formData, this.hostsList, this.requirementsList)


    const headers = new HttpHeaders({ Authorization: `Bearer ${this.authToken}` });

    this.http
      .post<{ event: { id: string } }>(
        `${environment.baseUrl}/events/createEvent`,
        formData,
        { headers }
      )
      .pipe(
        // When the first request completes, switch to the second API call
        switchMap((response) => {
          const event_id = response.event.id; // Fetch the event ID from the response
          const payload = {
            event_id: event_id,
            assignments: this.requirementsList.map((requirement) => ({
              requirement: requirement.requirement, // Map requirements list
              vendor_id: requirement.vendor_id,
            })),
          };
          // Make the second API call with the event_id and assignment payload
          return this.http.post(`${environment.baseUrl}/vendors/assignment`, payload);
        })
      )
      .subscribe(
        () => {
          console.log('Event Created and Vendor Assignment added Successfully');
          alert('Event Created and Vendor Assignment added Successfully');
          if (localStorage.getItem("userRole")?.toLowerCase() === "super_admin")
            this.router.navigate(['superadmin/events']);
          else
            this.router.navigate(['admin/events']);
        },
        (error) => {
          console.error('Error occurred', error);
        }
      );
  }
}
