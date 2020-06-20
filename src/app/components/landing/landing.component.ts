import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {

  role = 'unathorized';

  constructor(private router: Router,
              private authService: AuthService) {
    this.authService.userRole.subscribe(role => {
      this.role = role;
    });
   }

  ngOnInit() {
  }

  login() {
    if (this.role === 'unathorized') {
      this.router.navigate(['/login']);
    } else {
      this.router.navigate(['/home']);
    }
  }

  register() {
    this.router.navigate(['register']);
  }

  home() {
    this.router.navigate(['']);
  }

  learnMore() {
    const height = window.innerHeight - 85;
    window.scrollBy(0, height);
  }
}

/*
<div class="landing-outter" fxLayout="column">
  <img class="logo mlr-auto" src="../../../assets/pictures/BME_logo.png"/>
  <button mat-button class="learn-more mlr-auto mt-auto mb-lg">
    <p class="mt-xs mb-xs">Learn More</p>
  </button>
</div>
*/
