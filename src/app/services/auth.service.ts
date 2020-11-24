
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { UserService } from '../services/user.service';
import { BehaviorSubject } from 'rxjs';
import { id } from '@swimlane/ngx-charts';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // tslint:disable-next-line: variable-name
  public _user = null;
  // tslint:disable-next-line: variable-name
  public _token = null;
  // tslint:disable-next-line: variable-name
  public _uid = null;

  url = environment.apiUrl;
  emailVerified = false;
  userRole = new BehaviorSubject(null);
  tokenSubject: BehaviorSubject<string> = new BehaviorSubject(null);
  userSubject: BehaviorSubject<any> = new BehaviorSubject(null);
  _completedTutorial = false;

  get uid() {
    return this._uid;
  }

  get user() {
    return this._user;
  }
  get token() {
    return this._token;
  }

  get role() {
    return this.userRole;
  }

  get completedTutorial() {
    return this._completedTutorial;
  }

  constructor(public firebaseAuth: AngularFireAuth, private http: HttpClient, private userService: UserService) {
    this.firebaseAuth.user.subscribe(async user => {
      this._user = user;
      this.userSubject.next(user);
      if (user && user !== undefined) {
        this.userService.testToken();
        this._token = await user.getIdToken();
        this.tokenSubject.next(this._token);
        const idTokenResult = await user.getIdTokenResult();
        this.userRole.next(this.getRole(idTokenResult));
      } else {
        this.userRole.next('unathorized');
      }
      console.log(this.emailVerified);
    });
  }

  currentUserEmailVerified() {
    return this.emailVerified;
  }

  async resendEmail() {
    if (this._user) {
      return this._user.sendEmailVerification();
    }
  }

  async login(loginData: { email: string; password: string; }): Promise<any> {
    await this.firebaseAuth.signInWithEmailAndPassword(loginData.email, loginData.password);
  }

  async register({ email, password }: { email: string; password: string; }): Promise<any> {
    return this.http.post(`${ this.url }/signup`, { email, password }).toPromise();
  }

  async deleteUser(uid: string) {
    const params = new HttpParams().set('uid', uid);
    return this.http.delete(`${ this.url }/delete-user`, { params }).toPromise();
  }

  getRole(idTokenResult) {
    this.emailVerified = idTokenResult.claims.email_verified;
    this._uid = idTokenResult.claims.user_id;
    if (idTokenResult.claims.completedTutorial) {
      this._completedTutorial = idTokenResult.claims.completedTutorial;
    } else {
      this._completedTutorial = false;
    }

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

  async updateCustomClaims() {
    return this._user.getIdToken(true);
  }

  async sendPasswordResetEmail(email: string) {
    return this.firebaseAuth.sendPasswordResetEmail(email);
  }

  async sendVerificationEmail(verificationData: { email: string; password: string; }) {
    await this.login(verificationData);
    await setTimeout(() => {}, 300);
    return (await this.firebaseAuth.currentUser).sendEmailVerification();
  }

  async logout() {
    if (this._user) {
      return this.firebaseAuth.signOut();
    }
  }
}
