import { AuthService } from '../services/auth.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { SnackbarService } from '../services/snackbar.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

  role = '';
  routeToLoad = '';
  params = null;

  constructor(private authService: AuthService, private router: Router, private snackbar: SnackbarService) {
    this.authService.userRole.subscribe(role => {
      this.role = role;
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
    /* This is one weird work around to get the state to load and redirect unauthorized people */
    const result = this.checkRoute(route, state);
    if (!result && this.routeToLoad === '') { // if not reloading to get the token
      if (state.url !== '/home') { // to be nice i'm just taking
        this.router.navigate(['/home']);
      } else {
        this.router.navigate(['']);
      }
    }
    return result;
  }

  checkRoute(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (!this.role) {
      this.routeToLoad = state.url;
      this.params = route.queryParams;
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

    if (state.url.startsWith('/bubbleLocator')) {
      // @ts-ignore
      const firefox = typeof InstallTrigger !== 'undefined';
      // @ts-ignore
      const chrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);
      if (!(chrome || firefox)) {
        this.snackbar.showError('Only Chrome browsers supported');
        //return false;
      }
      if (firefox) {
        this.snackbar.showInfo('Please use Chrome for best experience');
      }
    }
    /* Routes with params */
    if (state.url.startsWith('/admin/users')) {
      return this.adminPermission();
    } else if (state.url.startsWith('/bubbleLocator/review-rating')) {
      return this.assistantPermission();
    } else if (state.url.startsWith('/bubbleLocator/view-video')) {
      return this.assistantPermission();
    } else if (state.url.startsWith('/admin/videos')) {
      return this.assistantPermission();
    }
    /*Routes without params */
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
      case '/tutorial': {
        return this.authService.currentUserEmailVerified();
      }
      case '/bubbleLocator/tutorial': {
        return this.authService.currentUserEmailVerified();
      }
      case '/admin/videos': {
        return this.assistantPermission();
      }
      case '/admin/assistants': {
        return this.adminPermission();
      }
      case '/admin/announcements': {
        return this.adminPermission();
      }
      case '/admin/users': {
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
