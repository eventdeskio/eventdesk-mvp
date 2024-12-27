import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../environment/environment';


@Injectable({
  providedIn: 'root'
})
export class SigninService {


  private apiUrl = `${environment.baseUrl}/auth/login`; // Replace with your actual API endpoint

  constructor(private http: HttpClient, private router: Router) {}

  signin(credentials: { username: string; password: string }) {
    this.http.post<{ token: string }>(this.apiUrl, credentials).subscribe({
      next: (response) => {
        const token = response.token;

        console.log("step 1 ===>",token)

        // Save the token (localStorage or sessionStorage)
        localStorage.setItem('authToken', token);

        console.log("step 1 ===>",localStorage.getItem("authToken"))

        // Decode the token to extract role
        const decodedToken: any = jwtDecode(token);

        console.log("step 3 ===>",decodedToken,decodedToken.role)

        localStorage.setItem("userId",decodedToken.id)
        localStorage.setItem("userRole",decodedToken.role)

        console.log("step 4 ===>",localStorage.getItem("userRole"))
        

        // Navigate based on role
        this.navigateToDashboard(decodedToken.role);
      },
      error: (err) => {
        console.error('Signin failed', err);
        alert('Invalid credentials. Please try again.');
      },
    });
  }

  private navigateToDashboard(role: string) {
    switch (role) {
      case 'ADMIN':
        console.log("admin user")
        this.router.navigate(['admin']);
        break;
      case 'HOST':
        this.router.navigate(['host']);
        break;
      case 'VENDOR':
        this.router.navigate(['vendor']);
        break;
      case 'SUPER_ADMIN':
        this.router.navigate(['superadmin']);
        break;
      default:
        console.error('Unknown role:', role);
        this.router.navigate(['/signin']); // Fallback to signin
        break;
    }
  }
}
