import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    //console.log('here');
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
