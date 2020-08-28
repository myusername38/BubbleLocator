import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { DialogConfirmationComponent } from '../../dialogs/dialog-confirmation/dialog-confirmation.component';
import { VideoMetadata } from '../../interfaces/video-metadata';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { UserService } from '../../services/user.service';
import { UserData } from '../../interfaces/user-data';
import { ExpandUserDialogComponent } from '../../dialogs/expand-user-dialog/expand-user-dialog.component';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { SearchDialogComponent } from '../../dialogs/search-dialog/search-dialog.component';
import { merge, Observable, BehaviorSubject } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss']
})
export class UserMenuComponent implements OnInit {

  usersPerPage = 10;
  videoTableData: VideoMetadata[] = [];
  videos: Observable<VideoMetadata[]> = null;
  usersCollection: AngularFirestoreCollection<VideoMetadata>;
  metadataCollection: AngularFirestoreCollection<VideoMetadata>;
  lastDoc = [];
  numDocs = 0;
  loading = true;
  role = '';
  userTypes = [
    { type: 'all', title: 'All Users' },
    { type: 'owners', title: 'Owners' },
    { type: 'admins', title: 'Admins' },
    { type: 'assistants', title: 'Assistants' },
    { type: 'raters', title: 'Raters' },
    { type: 'incomplete', title: 'Incomplete' },
  ];
  pageDirection = '';
  usersDisplayed = this.userTypes[0].type;
  usersDisplayedSubject: BehaviorSubject<string> = new BehaviorSubject(this.usersDisplayed);
  displayColumns: string[] = ['uid', 'role', 'score', 'rejected', 'expand'];
  query = null;
  direction = '';
  active = '';

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private authService: AuthService,
              private router: Router,
              private route: ActivatedRoute,
              private db: AngularFirestore,
              private userService: UserService,
              private snackbarService: SnackbarService,
              public dialog: MatDialog) {
                this.authService.userRole.subscribe(role => {
                  this.role = role;
                });
                this.route.queryParams.subscribe(params => {
                  if (params.uid) {
                    this.displayUser(params.uid);
                  }
                });
                this.metadataCollection = this.db.collection('metadata');
              }

  async ngOnInit() {
    this.metadataCollection.doc('users').ref.onSnapshot((doc) => {
      this.numDocs = doc.data().length;
    });
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => {
      this.paginator.pageIndex = 0;
      this.lastDoc = [];
    });

    merge(this.sort.sortChange, this.paginator.page, this.usersDisplayedSubject)
    .pipe(
      switchMap(() => {
        this.query = this.createQuery(this.sort.active, this.sort.direction);
        return this.query.get().catch((error) => {
          if (error.message === 'Missing or insufficient permissions.') {
            this.snackbarService.showError(error.message);
          }
          return null;
        });
      }),
      map(data => {
        this.loading = false;
        if (data) {
          // @ts-ignore:
          this.lastDoc.push(data.docs[data.docs.length - 1]);
          // @ts-ignore:
          return data.docs;
        }
        return data;
      }),
    ).subscribe(data => {
      if (data) {
        this.videoTableData = data.map(doc => doc.data());

      }
    });
  }

  createQuery(active, direction) {
    if (this.query && active === this.active && direction === this.direction && this.lastDoc[this.paginator.pageIndex - 1]) {
        return this.query.startAfter(this.lastDoc[this.paginator.pageIndex - 1]);
    } else {
      const baseQuery = this.db.collection('users').ref;
      let orderBy = '';
      if (active === 'score') {
        orderBy = 'userScore';
      } else if (active === 'rejected') {
        orderBy = 'ratingsRejected';
      }
      this.active = active;
      this.direction = direction;
      if (orderBy && orderBy !== '' && direction && direction !== '') {
        return baseQuery.orderBy(orderBy, direction).limit(this.usersPerPage);
      }
      return baseQuery.limit(this.usersPerPage);
    }
  }

  searchUser() {
    const dialogRef = this.dialog.open(SearchDialogComponent, {
      width: '500px',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.user) {
        this.expandUserDialog(result.user);
      }
    });
  }

  async displayUser(uid: string) {
    this.loading = true;
    const user = (await this.db.doc(`/users/${ uid }`).ref.get()).data() as UserData;
    this.loading = false;
    this.expandUserDialog(user);
  }

  expandUserDialog(user: UserData) {
    this.addParams(user.uid);
    const dialogRef = this.dialog.open(ExpandUserDialogComponent, {
      width: '700px',
      data: {
        user
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.action) {
        switch (result.action) {
          case 'delete':
            this.deleteUser(result.uid);
            this.resetParams();
            break;
          case 'ban':
            this.banUser(result.uid);
            this.resetParams();
            break;
          case 'viewed':
            break;
        }
      }
    });
  }

  addParams(uid) {
    window.history.replaceState({}, '', `/admin/users/?uid=${ uid }`);
  }

  resetParams() {
    window.history.replaceState({}, '', `/admin/users`);
  }

  async banUser(uid: string) {
    try {
      this.loading = true;
      await  this.userService.banUser(uid);
    } catch (err) {
      console.log(err);
    } finally {
      this.loading = false;
    }
  }
  async deleteUser(uid: string) {
    try {
      this.loading = true;
      await  this.userService.deleteUser(uid);
    } catch (err) {
      console.log(err);
    } finally {
      this.loading = false;
    }
  }
  navigate(page: string) {
    switch (page) {
      case 'assistants':
        this.router.navigate(['admin/assistants']);
        break;
      case 'users':
        this.router.navigate(['admin/users']);
        break;
      case 'admins':
        this.router.navigate(['admin/admins']);
        break;
      case 'owners':
        this.router.navigate(['admin/owners']);
        break;
      case 'videos':
        this.router.navigate(['admin/videos']);
        break;
      default:
        break;
    }
  }

  /*
  expandVideoData(video: VideoMetadata) {
    const dialogRef = this.dialog.open(ExpandVideoDialogComponent, {
      width: '800px',
      data: {
        video,
        type: this.videoDisplayedSubject.value,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'Confirm') {
        this.deleteVideo(video);
      }
    });
  }
  */
}
