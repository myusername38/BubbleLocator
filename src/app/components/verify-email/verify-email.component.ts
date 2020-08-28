import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SnackbarService } from '../../services/snackbar.service';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss']
})
export class VerifyEmailComponent implements OnInit {

  loading = false;

  constructor(private router: Router,
              private authService: AuthService,
              private snackbarService: SnackbarService,
              ) { }

  ngOnInit() {
    if (!this.authService.user) {
      this.snackbarService.showError('No user currently signed in');
      this.router.navigate(['/login']);
    }
  }

  async login() {
    await this.authService.logout();
    this.router.navigate(['login']);
  }

  async resendConfirmationEmail() {
    await this.authService.resendEmail();
    this.snackbarService.showInfo('Verification Email Sent');
  }

  async signInWithDifferentAccount() {
    await this.authService.logout();
    this.router.navigate(['login']);
  }
}
