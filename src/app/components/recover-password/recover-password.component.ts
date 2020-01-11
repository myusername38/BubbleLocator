import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { SnackbarService } from '../../services/snackbar.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recover-password',
  templateUrl: './recover-password.component.html',
  styleUrls: ['./recover-password.component.scss']
})
export class RecoverPasswordComponent implements OnInit {

  recoverForm: FormGroup;
  loading = false;
  email = new FormControl('', [Validators.required, Validators.email]);
  emailSent = false;

  constructor(
    private router: Router,
    private snackbarService: SnackbarService,
    private authService: AuthService) { }

  ngOnInit() {
    this.recoverForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
    });
  }

  getErrorMessage() {
    return this.email.hasError('required') ? 'You must enter a value' :
        this.email.hasError('email') ? 'Not a valid email' :
            '';
  }

  register() {
    this.router.navigate(['register']);
  }

  resetPassword() {
    this.router.navigate(['reset']);
  }

  goToLogin() {
    this.router.navigate(['login']);
  }

  async onSubmit() {
    try {
      this.loading = true;
      await this.authService.sendPasswordResetEmail(this.recoverForm.getRawValue().email);
      this.emailSent = true;
    } catch (err) {
      if (err.code === 'auth/user-not-found') {
        this.snackbarService.showError('No user associated with this email');
      } else if (err.code === 'auth/invalid-email') {
        this.snackbarService.showError('Invalid Email');
      } else {
        console.log(err);
      }
    } finally {
      this.loading = false;
    }
  }
}
