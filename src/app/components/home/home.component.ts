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
  showLegend = false;
  showXAxisLabel = true;
  xAxisLabel = 'Number';
  showYAxisLabel = true;
  yAxisLabel = 'Color Value';
  timeline = true;
  results = [
    {
      name: 'Timor-Leste',
      series: [
        {
          value: 4951,
          name: '2016-09-18T14:13:41.141Z'
        },
        {
          value: 6211,
          name: '2016-09-15T11:56:32.198Z'
        },
      ]
    },
  ];

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
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
