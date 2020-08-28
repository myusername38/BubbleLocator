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

  getUidFromEmail(email: string) {
    const params = new HttpParams().set('email', email);
    return this.http.get<{ uid: string }>(`${ this.url }/get-uid-from-email`, { params }).toPromise();
  }

  getUserScoreGraphData() {
    return this.http.get<{ top: number, user: number, accepted: number }>(`${ this.url}/get-user-score-graph-data`).toPromise();
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

  skipTutorial(uid: string) {
    return this.http.post(`${ this.url }/skip-tutorial`, { uid }).toPromise();
  }

  grantOwner(uid: string) {
    return this.http.post(`${ this.url }/grant-owner`, { uid }).toPromise();
  }

  deleteUser(uid: string) {
    const params = new HttpParams().set('uid', uid);
    return this.http.delete(`${ this.url }/delete-user`, { params }).toPromise();
  }

  removeUserAccount() {
    return this.http.delete(`${ this.url }/remove-user-account`).toPromise();
  }


  banUser(uid: string) {
    return this.http.put(`${ this.url }/ban-user`, { uid }).toPromise();
  }

  getUser(uid: string) {
    return this.db.doc(`/users/${ uid }`).ref.get();
  }

  removePermissions(uid: string) {
    const params = new HttpParams().set('uid', uid);
    return this.http.delete(`${ this.url }/remove-permissions`, { params }).toPromise();
  }
}
