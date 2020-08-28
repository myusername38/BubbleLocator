
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { UserService } from '../services/user.service';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // tslint:disable-next-line: variable-name
  public _user = null;
  // tslint:disable-next-line: variable-name
  public _token = null;

  url = environment.apiUrl;

  userRole = new BehaviorSubject(null);
  tokenSubject: BehaviorSubject<string> = new BehaviorSubject(null);
  userSubject: BehaviorSubject<any> = new BehaviorSubject(null);
  _completedTutorial = false;
  sendEmail = false;

  get uid() {
    return this._user.uid;
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
      if (user) {
        this.userService.testToken();
        this._token = await user.getIdToken();
        this.tokenSubject.next(this._token);
        const idTokenResult = await user.getIdTokenResult();
        this.userRole.next(this.getRole(idTokenResult));
      } else {
        this.userRole.next('unathorized');
      }
    });
  }

  currentUserEmailVerified() {
    if (this.firebaseAuth.auth.currentUser) {
      return this.firebaseAuth.auth.currentUser.emailVerified;
    }
    return false;
  }

  async resendEmail() {
    if (this._user) {
      return this._user.sendEmailVerification();
    }
  }

  async login({ email, password }: { email: string; password: string; }): Promise<any> {
    return this.firebaseAuth.auth.signInWithEmailAndPassword(email, password);
  }

  async register(email: string, password: string): Promise<any> {
    this.sendEmail = true;
    return this.http.post(`${ this.url }/signup`, { email, password }).toPromise();
  }

  async deleteUser(uid: string) {
    const params = new HttpParams().set('uid', uid);
    return this.http.delete(`${ this.url }/delete-user`, { params }).toPromise();
  }

  getRole(idTokenResult) {
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
    return this.firebaseAuth.auth.sendPasswordResetEmail(email);
  }

  async sendVerificationEmail(email: string, password: string) {
    await this.login({ email, password });
    return this.firebaseAuth.auth.currentUser.sendEmailVerification();
  }

  logout() {
    return this.firebaseAuth.auth.signOut();
  }
}
