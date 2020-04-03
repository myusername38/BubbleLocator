import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { RoleData } from '../interfaces/role-data';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  url = environment.apiUrl;

  constructor(private http: HttpClient, private db: AngularFirestore) { }

  testToken() {
    return this.http.get(`${ this.url }/token-refresh`);
  }

  getUid(email: string) {
    return this.http.post<{ uid: string }>(`${ this.url }/get-uid`, { email }).toPromise();
  }

  getAssistants() {
    return this.http.get<RoleData[]>(`${ this.url }/get-assistants`).toPromise();
  }

  getAdmins() {
    return this.http.get<RoleData[]>(`${ this.url }/get-admins`).toPromise();
  }

  getOwners() {
    return this.http.get<RoleData[]>(`${ this.url }/get-owners`).toPromise();
  }

  grantAssistant(uid: string) {
    return this.http.post(`${ this.url }/grant-assistant`, { uid }).toPromise();
  }

  grantAdmin(uid: string) {
    return this.http.post(`${ this.url }/grant-admin`, { uid }).toPromise();
  }

  grantOwner(uid: string) {
    return this.http.post(`${ this.url }/grant-owner`, { uid }).toPromise();
  }

  removePermissions(uid: string) {
    const params = new HttpParams().set('uid', uid);
    return this.http.delete(`${ this.url }/remove-permissions`, { params }).toPromise();
  }
}
