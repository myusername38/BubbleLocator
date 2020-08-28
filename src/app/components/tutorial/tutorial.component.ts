import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.component.html',
  styleUrls: ['./tutorial.component.scss']
})
export class TutorialComponent implements OnInit {

  completedTutorial = false;

  constructor(private router: Router, private authService: AuthService) {
    this.authService.userRole.subscribe(role => {
        this.completedTutorial = this.authService.completedTutorial;
    });
  }

  ngOnInit(): void {
  }

  home() {
    this.router.navigate(['/home']);
  }

  completeTutotiral() {
    this.router.navigate(['/bubbleLocator/tutorial']);
  }
}
