import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { UserService } from './user.service';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})

export class InterceptorService implements HttpInterceptor {
  private token: string = null;

  private refreshTokenInProgress = false;

  constructor(private router: Router, private authService: AuthService,
              private userService: UserService, public firebaseAuth: AngularFireAuth) {
    this.authService.tokenSubject.subscribe(token => {
      this.token = token;
    });
  }


  private refreshSubject: Subject<any> = new Subject<any>();

  private updateToken() {
    this.refreshSubject.subscribe({
      complete: () => {
        this.refreshSubject = new Subject<any>();
      }
    });
    if (this.refreshSubject.observers.length === 1) {
      // Hit refresh-token API passing the refresh token stored into the request
      // to get new access token and refresh token pair
      this.userService.testToken().subscribe(this.refreshSubject);
    }
    return this.refreshSubject;
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (request.url.endsWith('/logout') || request.url.endsWith('/token-refresh'), request.url.endsWith('/signup')) {
      return next.handle(request);
    } else if (this.token) {
      return next.handle(this.updateHeader(request));
    } else {
      return this.updateToken().pipe( // getting the refresh token then re sending the request
        switchMap(() => {
          if (this.token) {
            return next.handle(this.updateHeader(request));
          } else {
            this.router.navigate(['/login']);
          }
        })
      );
    }
  }

  updateHeader(request) {
    request = request.clone({
      setHeaders: {
        Token: this.token
      }
    });
    return request;
  }
}
