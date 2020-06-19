import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {


  constructor(private router: Router) {};

  ngOnInit() {}

  login() {
    this.router.navigate(['/login']);
  }

  register() {
    this.router.navigate(['register']);
  }

  home() {
    this.router.navigate(['']);
  }
}
