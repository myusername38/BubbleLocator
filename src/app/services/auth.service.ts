
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public _user = null;
  // tslint:disable-next-line: variable-name
  public _token = null;
  tokenSubject: BehaviorSubject<string> = new BehaviorSubject(null);
  userSubject: BehaviorSubject<any> = new BehaviorSubject(null);

  get user() {
    return this._user;
  }
  get token() {
    return this._token;
  }

  constructor(public firebaseAuth: AngularFireAuth) {
    this.firebaseAuth.user.subscribe(async user => {
      this._user = user;
      this.userSubject.next(user);
      if (user) {
        this._token = await user.getIdToken();
        // console.log('this._token', this._token);
        this.tokenSubject.next(this._token);
      }
    });
  }

  // TODO: any
  async login({ email, password }: { email: string; password: string; }): Promise<any> {
    return this.firebaseAuth.auth.signInWithEmailAndPassword(email, password);
  }

  async register({ email, password }: { email: string; password: string; }): Promise<any> {
    // register user
    // return this.firebaseAuth.auth.regis(email, password);
  }

  async sendVerificationEmail() {
    return this.firebaseAuth.auth.currentUser.sendEmailVerification();
  }

  logout() {
    return this.firebaseAuth.auth.signOut();
  }
}
