
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { UserService } from '../services/user.service'
import { BehaviorSubject, Subject } from 'rxjs';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { RouteConfigLoadEnd } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public _user = null;
  // tslint:disable-next-line: variable-name
  public _token = null;

  url = environment.apiUrl;

  userRole = new BehaviorSubject(null);
  tokenSubject: BehaviorSubject<string> = new BehaviorSubject(null);
  userSubject: BehaviorSubject<any> = new BehaviorSubject(null);

  get user() {
    return this._user;
  }
  get token() {
    return this._token;
  }

  get role() {
    return this.userRole;
  }

  constructor(public firebaseAuth: AngularFireAuth, private http: HttpClient, private userService: UserService) {
    this.firebaseAuth.user.subscribe(async user => {
      this._user = user;
      this.userSubject.next(user);
      if (user) {
        this.userService.testToken();
        this._token = await user.getIdToken();
        this.tokenSubject.next(this._token);
        const idTokenResult = await user.getIdTokenResult();
        this.userRole.next(this.getRole(idTokenResult));
      }
    });
  }

  async login({ email, password }: { email: string; password: string; }): Promise<any> {
    this.firebaseAuth.auth.signInWithEmailAndPassword(email, password)
  }

  async register({ email, password }: { email: string; password: string; }): Promise<any> {
    // register user
    // return this.firebaseAuth.auth.regis(email, password);
  }

  async deleteUser(uid: string) {
    const params = new HttpParams().set('uid', uid);
    return this.http.delete(`${ this.url }/delete-user`, { params }).toPromise();
  }

  getRole(idTokenResult) {
    if (idTokenResult.claims.assistant && idTokenResult.claims.assistant === true) {
      return 'assistant';
    } else if (idTokenResult.claims.admin && idTokenResult.claims.admin === true) {
      return 'admin';
    } else if (idTokenResult.claims.owner && idTokenResult.claims.owner === true) {
      return 'owner';
    } else {
      return 'user';
    }
  }


  async sendVerificationEmail() {
    return this.firebaseAuth.auth.currentUser.sendEmailVerification();
  }

  logout() {
    return this.firebaseAuth.auth.signOut();
  }
}
