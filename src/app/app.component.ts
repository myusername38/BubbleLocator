import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from './services/user.service';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'bme';
  role = '';
  url = ''

  constructor(private router: Router, private authService: AuthService) {
    this.authService.userRole.subscribe(role => {
      this.role = role;
    });
    this.router.events.subscribe((event) => {
      this.url = this.router.url;
    });
  }

  login() {
    this.router.navigate(['/login']);
  }

  register() {
    this.router.navigate(['register']);
  }

  home() {
    this.router.navigate(['']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  navigate(url: string) {
    this.router.navigate([url]);
  }

  showAdminMenu() {
    if (this.url.substr(0, 6) === '/admin') {
      return true;
    }
    return false;
  }

  showLogin() {
    switch (this.router.url) {
      case '/':
        return true;
      case '/login':
        return true;
      case '/register':
        return true;
      default:
        return false;
    }
  }
}
