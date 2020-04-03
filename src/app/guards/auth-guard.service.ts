import { AuthService } from '../services/auth.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, Route } from '@angular/router';
import { SnackbarService } from '../services/snackbar.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

  role = '';
  routeToLoad = '';
  params = null;

  constructor(private authService: AuthService, private router: Router, private snackbar: SnackbarService) {
    this.authService.userRole.subscribe(role => {
      this.role = role;
      console.log(this.routeToLoad);
      if (this.routeToLoad) {
        const route = this.routeToLoad;
        this.routeToLoad = '';
        if (this.params) {
          const queryParams = this.params;
          this.router.navigate([route], { queryParams });
          this.params = null;
        } else {
          this.router.navigate([route]);
        }
      }
    });
  }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (!this.role) {
      this.routeToLoad = state.url;
      this.params = route.queryParams;
      // if (state.url.startsWith('/bubbleLocator/review-rating')) {
      const endOfUrl = this.routeToLoad.indexOf('?');
      if (endOfUrl !== -1) {
        this.routeToLoad = this.routeToLoad.substr(0, endOfUrl);
      }
    }
    if (!this.authService.currentUserEmailVerified()) {
      if (!this.authService.token) {
        return;
      }
      this.router.navigate(['verify-email']);
      return false;
    }
    if (state.url.startsWith('/bubbleLocator/review-rating')) {
      return this.assistantPermission();
    }
    switch (state.url ) { // for role based locations
      case '/home': {
        return true;
      }
      case '/bubbleLocator': {
        if (!this.authService.completedTutorial) {
          this.snackbar.showError('You must complete the tutorial');
        }
        return this.authService.completedTutorial;
      }
      case '/admin/videos': {
        return this.assistantPermission();
      }
      case '/admin/assistants': {
        return this.adminPermission();
      }
      case '/admin/admins': {
        return this.ownerPermission();
      }
      case '/admin/owners': {
        return this.ownerPermission();
      }
      default: {
        return false;
      }
    }
  }

  ownerPermission() {
    return this.role === 'owner';
  }

  adminPermission() {
    return this.role === 'admin' || this.role === 'owner';
  }

  assistantPermission() {
    return this.role === 'owner' || this.role === 'admin' || this.role === 'assistant';
  }

  isEmpty(obj) {
    obj.forEach(key => {
      if (obj.hasOwnProperty(key)) {
        return false;
      }
    });
    return true;
  }
}
