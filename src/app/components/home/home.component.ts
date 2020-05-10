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
      series: []
    },
  ];

  colorScheme = {
    domain: ['#406E8E', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  constructor(private authService: AuthService,
              private db: AngularFirestore,
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
    this.db.collection('ratingsPerDay').ref.limit(10).orderBy('date', 'desc').onSnapshot((data) => {
      console.log('here');
      const series = [];
      data.forEach(doc => {
        const d = doc.data();
        series.push({ value: d.ratings, name: new Date(d.date) });
      });
      this.results[0].series = series;
      this.results = [...this.results];
    });
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
