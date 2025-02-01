import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  // private apiUrl = 'http://localhost:5000'; 
  private apiUrl = 'https://api.eventdesk.io'; 


  constructor(private http: HttpClient) {}

  getResumes(page: number, limit: number): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<any>(`${this.apiUrl}/getlist`, { params });
  }

  uploadFile(file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);

    // Send POST request to upload file
    return this.http.post<any>(`${this.apiUrl}/upload`, formData);
  }

  // API call to save form details after uploading the resume
  saveDetails(formData: FormGroup, fileLink: string): Observable<any> {
    // Preparing the data to send to the backend
    const details = {
      firstName: formData.get('firstName')?.value,
      lastName: formData.get('lastName')?.value,
      email: formData.get('email')?.value,
      phoneNumber: formData.get('phoneNumber')?.value,
      city: formData.get('city')?.value,
      state: formData.get('state')?.value,
      linkedin: formData.get('linkedin')?.value,
      portfolio: formData.get('portfolio')?.value,
      resume: fileLink,  // Link to the uploaded file
      message: formData.get('message')?.value,
    };

    // Send POST request to save the form data
    return this.http.post<any>(`${this.apiUrl}/savedetails`, details);
  }
}