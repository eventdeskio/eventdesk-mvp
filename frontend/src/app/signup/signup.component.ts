import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environment/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
  imports: [CommonModule, ReactiveFormsModule],
})
export class SignupComponent implements OnInit {
  @Output() close = new EventEmitter<void>(); // EventEmitter for closing the modal
  signupForm: FormGroup;
  isAdminRole: boolean = false;
  companienames: any[] = [];

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      full_name: ['', Validators.required],
      role: ['HOST', Validators.required], // Default role
      company_name: [''],
    });
  }

  ngOnInit(): void {
    this.fetchAllCompanyName();
  }

  fetchAllCompanyName() {
    this.http.get(`${environment.baseUrl}/getallcompany`).subscribe((response: any) => {
      this.companienames = response.company;
    });
  }

  onRoleChange(event: any): void {
    const role = event.target.value;
    this.isAdminRole = role === 'ADMIN';

    if (this.isAdminRole) {
      this.signupForm.get('company_name')?.setValidators([Validators.required]);
    } else {
      this.signupForm.get('company_name')?.clearValidators();
    }
    this.signupForm.get('company_name')?.updateValueAndValidity();
  }

  onSubmit(): void {
    if (this.signupForm.invalid) return;

    const formData = this.signupForm.value;

    const requestdata = {
      email: formData.email,
      password: formData.password,
      full_name: formData.full_name,
      role: formData.role,
    };

    // Send the first API call to register the user
    this.http.post(`${environment.baseUrl}/auth/signup`, requestdata).subscribe({
      next: (response: any) => {
        if (response?.user?.id && formData.role === 'ADMIN') {
          const companyInfo = {
            new_admin_id: response.user.id,
            company_name: formData.company_name,
          };

          this.http.put(`${environment.baseUrl}/update-admin`, companyInfo).subscribe({
            next: (response2: any) => {
              console.log('Admin added to Company Successfully:', response2);
              this.closeModal("sign up successfull!"); // Close the modal after success
            },
            error: (error2) => {
              console.error('Error registering company:', error2);
            },
          });
        } else if (response?.user?.id && formData.role !== 'ADMIN') {
          this.closeModal("signup successfull"); // Close the modal after success
        } else {
          console.error('Admin registration failed. No user ID received.');
        }
      },
      error: (error1) => {
        console.error('Error during admin registration:', error1);
      },
    });
  }

  closeModal(msg:any): void {
    if(msg!=="")
      alert(msg)
    this.close.emit(); // Emit the close event
  }
}
