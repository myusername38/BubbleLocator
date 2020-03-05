import { AuthService } from '../services/auth.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, Route } from '@angular/router';
import { SnackbarService } from '../services/snackbar.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

  role = '';
  routeToLoad = '';

  constructor(private authService: AuthService, private router: Router, private snackbar: SnackbarService) {
    this.authService.userRole.subscribe(role => {
      this.role = role;
      if (this.routeToLoad) {
        const route = this.routeToLoad;
        this.routeToLoad = '';
        this.router.navigate([route]);
      }
    });
  }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (!this.role) {
      this.routeToLoad = state.url;
    }
    if (!this.authService.currentUserEmailVerified()) {
      if (!this.authService.token) {
        return;
      }
      this.router.navigate(['verify-email']);
      return false;
    }
    switch (state.url ) {
      case '/home': {
        return true;
      }
      case '/bubbleLocator': {
        return true;
      }
      case '/admin/videos': {
        return this.role === 'owner' || this.role === 'admin' || this.role === 'assistant';
      }
      case '/bubbleLocator': {
        return this.role === 'owner' || this.role === 'admin' || this.role === 'assistant';
      }
      case '/admin/assistants': {
        return this.role === 'admin' || this.role === 'owner';
      }
      case '/admin/admins': {
        return this.role === 'owner';
      }
      case '/admin/owners': {
        return this.role === 'owner';
      }
      default: {
        this.router.navigate(['']);
      }
    }
  }
}
