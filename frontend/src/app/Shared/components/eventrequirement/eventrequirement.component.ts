import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserfetchService } from '../../../services/userfetch.service';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormArray } from '@angular/forms';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../../../environment/environment';


@Component({
  selector: 'app-eventrequirement',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './eventrequirement.component.html',
  styleUrls: ['./eventrequirement.component.css'],
})
export class EventrequirementComponent implements OnInit {
  @Input() event_id: any;
  authToken: string = '';
  company_id: string = '';
  admin_id: string = '';
  vendorReturned: any[] = [];
  selectedService: string = '';
  selectedVendorId: string = '';
  budgetAmount: number = 0;
  // budgetAllocationForm:FormGroup;

  budgetAllocationForm!: FormGroup;

  filteredVendors:any[] = [];

  // vendors = [
  //   { id: '7cb58143-5080-4cf3-ac59-8aaa678a3d08', name: 'Vendor 1' },
  //   { id: '17f4175b-3452-485b-a2a6-3913a9d6edd7', name: 'Vendor 2' },
  // ];

  vendors:any[]=[];
  

  constructor(private fb: FormBuilder,private http: HttpClient) {
    this.budgetAllocationForm = this.fb.group({
      selectedService: ['', Validators.required],
      selectedVendorId: ['', Validators.required],
      budgetAmount: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.budgetAllocationForm = this.fb.group({
      selectedService: ['', Validators.required],
      selectedVendorId: ['', Validators.required],
      budgetAmount: ['', [Validators.required, Validators.min(1)]],
    });

    this.fetchInitialData();
    // Initialize with all vendors as default
    this.filteredVendors = this.vendorReturned;
  }

  fetchInitialData(): void {
    this.authToken = localStorage.getItem('authToken') || '';
    const decodedToken: any = jwtDecode(this.authToken);
    this.company_id = decodedToken.company_id;
    this.admin_id = decodedToken.admin_id;

    // Fetch vendors
    this.http
      .post<{ data: any[] }>(`${environment.baseUrl}/vendors/withid`, {
        event_id: this.event_id,
      })
      .subscribe(
        (response: any) => {
          this.vendorReturned = response.event;
          this.vendorReturned.map(vendor => {
            console.log(vendor.vendor_id)
            this.http.post(`${environment.baseUrl}/users/fetchfullname`,{ id : vendor.vendor_id}).subscribe((response:any)=>{
                console.log("name is",response.fullName)
                this.vendors.push({
                  id:vendor.vendor_id,
                  name:response.fullName
                })
            })
          })
          console.log('Fetched Vendors:', this.vendorReturned);
        },
        (error) => {
          console.error('Error fetching vendors:', error);
        }
      );




  }


  onServiceChange(): void {
    const selectedService = this.budgetAllocationForm.get('selectedService')?.value;

    // Filter vendors based on selected service
    this.filteredVendors = this.vendorReturned.filter(
      (vendor) => vendor.service === selectedService
    );

    // Reset vendor ID selection if it no longer matches the filtered list
    this.budgetAllocationForm.get('selectedVendorId')?.setValue('');
  }


  getVendorName(vendorId: string): string {
    const vendor = this.vendors.find((v) => v.id === vendorId);
    return vendor ? vendor.name : 'Unknown Vendor';
  }

  calculateTotalBudget(): string {
    const total = this.vendorReturned.reduce((sum, item) => {
      return sum + (item.budget ? parseFloat(item.budget) : 0);
    }, 0);
    return total.toFixed(2);
  }


  onSubmit(): void {
    if (!this.budgetAllocationForm.value.selectedService || !this.budgetAllocationForm.value.selectedVendorId || this.budgetAllocationForm.value.budgetAmount <= 0) {
      alert('Please select a service and enter a valid budget!');
      return;
    }
  
    console.log(this.budgetAllocationForm.value);
  
    // Update budget for the selected vendor
    this.http
      .post(`${environment.baseUrl}/vendors/updateBudget`, {
        event_id: this.event_id,
        vendor_id: this.budgetAllocationForm.value.selectedVendorId,
        service: this.budgetAllocationForm.value.selectedService,
        budget: this.budgetAllocationForm.value.budgetAmount,
      })
      .subscribe(
        (response) => {
          alert('Budget saved successfully!');
          console.log('Budget saved:', response);
  
          // Reload the data to refresh the table
          this.fetchInitialData();  // Re-fetch the vendor data to update the table
        },
        (error) => {
          console.error('Error saving budget:', error);
          alert('Failed to save budget. Please try again.');
        }
      );
  }
  
}
