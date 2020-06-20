import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  loading = false;
  admin = false;
  completedTutorial = false;
  view: any[] = [700, 400];
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  xAxisLabel = 'Number';
  showYAxisLabel = true;
  yAxisLabel = 'Reviews Per Day';
  timeline = true;
  accepted = 0;
  results = [
    {
      name: 'Video Reviews',
      series: []
    },
  ];
  tileData = [{ item: 'Unique Raters', docRef: '/metadata/users' },
  { item: 'All time ratings', docRef: '/metadata/all-time-ratings' },
  { item: 'Videos Completed', docRef: '/metadata/complete-videos' },
  ];
  announcement = {};
  barColorScheme = {
    domain: ['#00A7E1', '#D00000']
  };
  colorScheme = {
    domain: ['#406E8E', '#A10A28', '#C7B42C', '#AAAAAA']
  };
  usersData = [
    {
      name: 'Top Rater',
      value: 1,
      color: this.colorScheme.domain[0]
    }
  ];
  percentage = 'Accepted percentage: 100%';

  constructor(private authService: AuthService,
              private db: AngularFirestore,
              private router: Router,
              private snackbacService: SnackbarService,
              private userService: UserService) {
    this.authService.userRole.subscribe(role => {
      if (role !== 'user') {
        this.admin = true;
        this.completedTutorial = this.authService.completedTutorial;
      }
    });
  }

  public dateTickFormatting(val: any): string {
    return new Date(val).toLocaleDateString();
  }

  ngOnInit() {
    this.db.collection('ratingsPerDay').ref.limit(10).orderBy('date', 'asc').onSnapshot((data) => {
      const series = [];
      data.forEach(doc => {
        const d = doc.data();
        series.push({ value: d.ratings, name: new Date(d.date).toISOString() });
      });
      this.results[0].series = series;
      this.results = [...this.results];
    });
    /*
    this.db.collection('announcements').ref.limit(1).orderBy('date', 'asc').onSnapshot(data => {
      data.forEach(doc => {
        this.announcement = doc.data();
      });
    });
    */
    this.getUsersData();
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

  logout() {
    this.authService.logout();
    this.snackbacService.showInfo('Successfully logged out');
    this.router.navigate(['/']);
  }

  async getUsersData() {
    try {
      this.loading = true;
      const data = await this.userService.getUserScoreGraphData();
      this.usersData = [
        {
          name: 'Top Rater',
          value: data.top,
          color: this.barColorScheme.domain[0]
        },
      ];
      if (data.user !== 0) {
        this.usersData.push({
          name: 'Your Score',
          value: data.user,
          color: this.barColorScheme.domain[1]
        });
      }
      this.accepted = data.accepted;
      this.tileData = [...this.tileData];
      this.usersData = [...this.usersData];
    } catch (err) {
      console.log(err);
    } finally {
      this.loading = false;
    }
  }
}
