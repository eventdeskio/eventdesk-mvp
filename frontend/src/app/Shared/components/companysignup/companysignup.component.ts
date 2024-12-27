import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environment/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-companysignup',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './companysignup.component.html',
  styleUrl: './companysignup.component.css',
  standalone:true
})
export class CompanysignupComponent implements OnInit{
  signupForm: FormGroup;
  isAdminRole: boolean = false;

  constructor(private fb: FormBuilder,private http:HttpClient,private router:Router) {
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      full_name: ['', Validators.required],
      role: ['ADMIN'], // Default role
      company_name: [''],
      company_address: [''],
      gst_number: [''],
      company_email: ['', [Validators.email]],
      company_helpline:['',[Validators.required,Validators.minLength(10),Validators.maxLength(10)]]
    });
  }

  ngOnInit(): void {}

  

  onSubmit(): void {
    if (this.signupForm.invalid) return;
  
    // Get form data
    const formData = this.signupForm.value;
  
    // Prepare the request data for the first API call (sign-up)
    const requestdata = {
      email: formData.email,
      password: formData.password,
      full_name: formData.full_name,
      role: formData.role
    };
  
    console.log('General Sign-Up Data:', formData);
  
    // Send the first API call to register the user
    this.http.post(`${environment.baseUrl}/auth/signup`, requestdata).subscribe({
      next: (response: any) => {
        // Check if the response contains the user ID
        if (response?.user?.id) {
          console.log("Admin Registered with ID:", response.user.id);
  
          // Prepare company information to send in the second API call
          const companyInfo = {
            company_name: formData.company_name,
            adminId: response.user.id, // Use the newly registered admin ID
            company_address: formData.company_address,
            GST_Number: formData.gst_number,
            company_email: formData.company_email,
            company_helplline_number: formData.company_helpline
          };
  
          // Send the second API call to register the company
          this.http.post(`${environment.baseUrl}/createAdmin`, companyInfo).subscribe({
            next: (response2: any) => {
              console.log("Company Registered Successfully:", response2);
              alert("Company Registered Successfully!")
              this.router.navigate(['superadmin/events']);
              // Additional logic after company registration, if needed
            },
            error: (error2) => {
              console.error("Error registering company:", error2);
              // Handle company registration error
            }
          });
        } else {
          console.error("Admin registration failed. No user ID received.");
          // Handle error if the admin registration fails
        }
      },
      error: (error1) => {
        console.error("Error during admin registration:", error1);
        // Handle general sign-up error
      }
    });
  
    console.log('General Sign-Up Data:', requestdata);
  }
  
  closeModal(): void {
    // Logic to close the modal
    // this.close.emit();
  }
}
