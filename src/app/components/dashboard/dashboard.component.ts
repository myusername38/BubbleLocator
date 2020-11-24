import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { SnackbarService } from '../../services/snackbar.service';
import { Announcement } from '../../interfaces/announcement';
import { ViewAnnouncementDialogComponent } from '../../dialogs/view-announcement-dialog/view-announcement-dialog.component';
import { UserInfoDialogComponent } from '../../dialogs/user-info-dialog/user-info-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { WelcomeDialogComponent } from '../../dialogs/welcome-dialog/welcome-dialog.component';
import { DialogConfirmationComponent } from '../../dialogs/dialog-confirmation/dialog-confirmation.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  mobileMenu = false;
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
  { item: 'All Time Ratings', docRef: '/metadata/all-time-ratings' },
  { item: 'Videos in Database', docRef: '/metadata/videos-added' },
  ];
  barColorScheme = {
    domain: ['#00A7E1', '#D00000']
  };
  colorScheme = {
    domain: ['#406E8E', '#A10A28', '#C7B42C', '#AAAAAA']
  };
  topScoreData = [
    {
      name: 'Top Rater',
      value: 1,
      color: this.colorScheme.domain[0]
    }
  ];
  percentage = 'Accepted percentage: 100%';
  announcement: Announcement = null;
  announcementId = '';
  firstLoad = true;

  constructor(private authService: AuthService,
              private db: AngularFirestore,
              private router: Router,
              private snackbacService: SnackbarService,
              private dialog: MatDialog,
              private userService: UserService) {
    this.authService.userRole.subscribe(role => {
      if (role !== 'user' && role !== 'unathorized') {
        this.admin = true;
      }
      this.completedTutorial = this.authService.completedTutorial;
      if (role && this.firstLoad) {
        this.loadData();
        this.firstLoad = false;
      }
    });
  }

  public dateTickFormatting(val: any): string {
    return new Date(val).toLocaleDateString();
  }

  loadData() {
    this.db.collection('ratingsPerDay').ref.limit(10).orderBy('date', 'asc').onSnapshot((data) => {
      const series = [];
      data.forEach(doc => {
        const d = doc.data();
        series.push({ value: d.ratings, name: new Date(d.date).toISOString() });
      });
      this.results[0].series = series;
      this.results = [...this.results];
    });
    this.getUsersData();
    this.getAnnouncement();
  }

  async getAnnouncement() {
    try {
      this.loading = true;
      const docs = (await this.db.collection('announcements').ref.limit(1).orderBy('added', 'desc').get());
      docs.forEach(doc => {
        const announcement = (doc.data() as Announcement);
        if (announcement.expire > Date.now()) { // making sure the announcement has not expired
          this.announcement = announcement;
          if (!localStorage[doc.id] && this.router.isActive('/home', true)) {
            this.announcementId = doc.id;
          }
        }
      });
      // this.showDialog();
    } catch (err) {
      console.log(err);
    } finally {
      this.loading = false;
    }
  }

  showDialog() {
    if (this.completedTutorial && this.announcementId) {
      this.expandAnnouncement();
    } else if (!(localStorage.completedFirst || this.completedTutorial)) {
      this.showWelcomeMessage();
    }
  }

  goToLanding() {
    this.router.navigate(['']);
  }

  completeTutorial() {
    this.router.navigate(['/tutorial']);
  }

  locateBubbles() {
    this.router.navigate(['/bubbleLocator']);
  }

  adminNav() {
    this.router.navigate(['/admin/videos']);
  }

  toggleMobileMenu() {
    this.mobileMenu = !this.mobileMenu;
  }

  expandAnnouncement() {
    const dialogRef = this.dialog.open(ViewAnnouncementDialogComponent, {
      width: '1000px',
      maxHeight: '90vh',
      data: this.announcement,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (this.announcementId) { // only way this is not null is if there is announcementId
        localStorage[this.announcementId] = true;
      }
    });
  }

  openUserInfoDialog() {
    const dialogRef = this.dialog.open(UserInfoDialogComponent, {
      width: '600px',
      maxHeight: '90vh',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.action === 'logout') {
        this.logout();
      } else if (result.action === 'delete') {
        this.deleteUser();
      }
    });
  }

  async deleteUser() {
    const dialogRef = this.dialog.open(DialogConfirmationComponent, {
      width: '500px',
      data: {
        options: [
          'Delete', 'Cancel'
        ],
        message: 'Confirm Deleting Account',
        description: 'Careful! Deleting your account will require you to complete the tutorial again to rate videos'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'Delete') {
        this.removeUserAccount();
      }
    });
  }

  async removeUserAccount() {
    try {
      this.loading = true;
      await this.userService.removeUserAccount();
      this.authService.logout();
      this.snackbacService.showInfo('Account successfully removed');
      this.router.navigate(['/']);
    } catch (err) {
      console.log(err);
    } finally {
      this.loading = false;
    }
  }

  logout() {
    this.authService.logout();
    this.snackbacService.showInfo('Successfully logged out');
    this.router.navigate(['/']);
  }

  async getUsersData() {
    try {
      let topRater = null;
      let user = null;
      await Promise.all([
        user = (await this.db.doc(`/users/${ this.authService.uid }`).ref.get()).data(),
        (await this.db.collection(`users`).ref.limit(1).orderBy('userScore', 'desc').get()).forEach(rater => {
          topRater = rater.data();
        })
      ]);
      this.accepted = user.accepted;
      this.topScoreData = [
        {
          name: 'Top Rater',
          value: topRater.userScore,
          color: this.colorScheme.domain[0]
        },
        {
          name: 'Your Score',
          value: user.userScore,
          color: this.colorScheme.domain[1]
        },
      ];
    } catch (err) {
      console.log(err);
    } finally {
      this.loading = false;
    }
  }

  showWelcomeMessage() {
    const dialogRef = this.dialog.open(WelcomeDialogComponent, {
      width: '800 px',
      maxHeight: '90vh',
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }
}
