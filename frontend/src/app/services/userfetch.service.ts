import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class UserfetchService {
  private baseUrl = environment.baseUrl; 
  constructor(private http: HttpClient) {}

  fetchAdminInfo(id: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/adminInfo`, [id]);
  }

  fetchEventDetails(eventId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/events/`+eventId);
  }

  fetchAllHost(){
    return this.http.get(`${this.baseUrl}/users/getallhosts`); 
  }

  fetchAllVendors(){
    return this.http.get(`${this.baseUrl}/users/getallvendors`); 
  }


  fetchAllAdmins(){
    return this.http.get(`${this.baseUrl}/users/getalladmins`); 
  }

  fetchAllCompanies(){
    return this.http.get(`${this.baseUrl}/superadmin/getallcompany`); 
  }

  fetchHosts(hostIds: string[]): Observable<any>[] {
    return hostIds.map(hostId => this.http.get(`${this.baseUrl}/users/${hostId}`));
  }

  fetchVendors(vendorIds: string[]): Observable<any>[] {
    return vendorIds.map(vendorId => this.http.get(`${this.baseUrl}/users/${vendorId}`));
  }

  fetchVendorsFromVendorAssignment(vendorIds: string[]): Observable<any>[] {
    return vendorIds.map(vendorId => this.http.post(`${this.baseUrl}/vendors/withid`,{event_id:vendorId}));
  }

  fetchAdmins(vendorIds: string[]): Observable<any>[] {
    return vendorIds.map(vendorId => this.http.get(`${this.baseUrl}/users/${vendorId}`));
  }

  fetchAdminWithId(adminId: any): Observable<any> {
    return this.http.get(`${this.baseUrl}/users/${adminId}`);
  }
  


}
