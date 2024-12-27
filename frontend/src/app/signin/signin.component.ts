import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SigninService } from '../services/signin.service';
import { SignupComponent } from '../signup/signup.component';
import { CommonModule } from '@angular/common';
import { environment } from '../../environment/environment';


@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule,SignupComponent,CommonModule],
})
export class SigninComponent {
  signinForm: FormGroup;
  showSignupModal: boolean = false;

  showPassword: boolean = false;

  
  pencard:any="../../assests/pencard.png";
  constructor(
    private fb: FormBuilder,
    private signinService:SigninService,
  ) {
    console.log("env",environment.baseUrl)
    this.signinForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  openSignupModal() {
    this.showSignupModal = true;
  }

  closeSignupModal() {
    this.showSignupModal = false;
  }


  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.signinForm.valid) {
      this.signinService.signin(this.signinForm.value);
      
    } else {
      alert('Please fill in all fields');
    }
  }

  
}
