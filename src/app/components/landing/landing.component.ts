import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {

  acceptedCookiePolicy = false;
  role = 'unathorized';
  mobileMenu = false;

  constructor(private router: Router,
              private authService: AuthService) {
    this.authService.userRole.subscribe(role => {
      this.role = role;
    });
   }

  ngOnInit() {
    if (localStorage.acceptedCookies) {
      this.acceptedCookiePolicy = true;
    }
  }

  login() {
    if (this.role !== 'unathorized' && this.authService.currentUserEmailVerified()) {
      this.router.navigate(['/home']);
    } else if (this.authService.user  && !this.authService.currentUserEmailVerified()) {
      this.mobileMenu = false;
      this.router.navigate(['/verify-email']);
    } else {
      this.mobileMenu = false;
      this.router.navigate(['/login']);
    }
  }

  toggleMobileMenu() {
    this.mobileMenu = !this.mobileMenu;
  }

  register() {
    this.mobileMenu = false;
    this.router.navigate(['register']);
  }

  accept() {
    localStorage.acceptedCookies = true;
    this.acceptedCookiePolicy = true;
  }

  privacyPolicy() {
    this.router.navigate(['privacy-policy']);
  }

  home() {
    this.mobileMenu = false;
    this.router.navigate(['']);
  }

  learnMore() {
    const height = window.innerHeight - 85;
    window.scrollBy(0, height);
  }
}
