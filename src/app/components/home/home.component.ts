import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  loading = false;
  admin = false;
  view: any[] = [700, 400];
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  xAxisLabel = 'Number';
  showYAxisLabel = true;
  yAxisLabel = 'Videos Reviewed';
  timeline = true;
  results = [
    {
      name: 'Videos Reviewed',
      series: [
        {
          value: 200,
          name: '2016-09-18T14:13:41.141Z'
        },
        {
          value: 250,
          name: '2016-10-15T11:56:32.198Z'
        },
        {
          value: 100,
          name: '2016-11-18T14:13:41.141Z'
        },
        {
          value: 300,
          name: '2016-12-15T11:56:32.198Z'
        },
      ]
    },
  ];

  colorScheme = {
    domain: ['#406E8E', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  constructor(private authService: AuthService,
              private router: Router) {
    this.authService.userRole.subscribe(role => {
      if (role !== 'user') {
        this.admin = true;
      }
    });
  }

  public dateTickFormatting(val: any): string {
    return new Date(val).toLocaleDateString();
  }

  ngOnInit() {

  }

  locateBubbles() {
    this.router.navigate(['/bubbleLocator']);
  }

  learnMore() {
    const height = window.innerHeight - 85;
    window.scrollBy(0, height);
  }

  adminNav() {
    this.router.navigate(['/admin/videos']);
  }

  navigate() {

  }
}
