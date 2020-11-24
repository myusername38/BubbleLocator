import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { SnackbarService } from '../../services/snackbar.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  loading = false;
  windowRef: any;
  email = new FormControl('', [Validators.required, Validators.email]);

  constructor(
    private router: Router,
    private snackbarService: SnackbarService,
    private authService: AuthService) { }

  ngOnInit() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
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
    this.router.navigate(['/recover-password']);
  }

  async onSubmit() {
    try {
      this.loading = true;
      await this.authService.login(this.loginForm.getRawValue());
      await setTimeout(() => {
        if (this.authService.currentUserEmailVerified()) {
          this.router.navigate(['/home']);
        } else {
          this.router.navigate(['/verify-email']);
        }
      }, 500);
    } catch ({ message = 'Error authentication, please try again' }) {
      this.snackbarService.showError(message, 'Close');
    } finally {
      this.loading = false;
    }
  }
}
