import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { AddVideoDialogComponent } from '../add-video-dialog/add-video-dialog.component';
import { DialogConfirmationComponent } from '../dialog-confirmation/dialog-confirmation.component';
import { VideoMetadata } from '../../interfaces/video-metadata';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { VideoService } from '../../services/video.service';
import { ExpandVideoDialogComponent } from '../expand-video-dialog/expand-video-dialog.component';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { merge, Observable, BehaviorSubject } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

@Component({
  selector: 'app-video-menu',
  templateUrl: './video-menu.component.html',
  styleUrls: ['./video-menu.component.scss']
})
export class VideoMenuComponent implements OnInit, AfterViewInit {

  videosPerPage = 10;
  videoTableData: VideoMetadata[] = [];
  videos: Observable<VideoMetadata[]> = null;
  incompleteVideoCollection: AngularFirestoreCollection<VideoMetadata>;
  tutorialVideoCollection: AngularFirestoreCollection<VideoMetadata>;
  completeVideoCollection: AngularFirestoreCollection<VideoMetadata>;
  metadataCollection: AngularFirestoreCollection<VideoMetadata>;
  tutorialVideos = 0;
  completeVideos = 0;
  incompleteVideos = 0;
  lastDoc = [];
  numDocs = 0;
  loading = true;
  role = '';
  videoTypes = [
    { type: 'incomplete', title: 'Incomplete' },
    { type: 'complete', title: 'Complete' },
    { type: 'tutorial', title: 'Tutorial' }
  ];
  pageDirection = '';
  videosDisplayed = this.videoTypes[0].type;
  videoDisplayedSubject: BehaviorSubject<string> = new BehaviorSubject(this.videosDisplayed);
  incomleteColumns: string[] = ['created', 'title', 'status', 'user', 'expand'];
  tutorialColumns: string[] = ['created', 'title', 'average', 'quality', 'added', 'user', 'expand'];
  completeColumns: string[] = ['complete', 'title', 'average', 'quality', 'raters', 'expand'];
  displayColumns: string[] = this.incomleteColumns;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private authService: AuthService,
              private router: Router,
              private route: ActivatedRoute,
              private db: AngularFirestore,
              private videoService: VideoService,
              private snackbarService: SnackbarService,
              public dialog: MatDialog) {
                this.authService.userRole.subscribe(role => {
                  this.role = role;
                });
                this.incompleteVideoCollection = this.db.collection('incomplete-videos');
                this.tutorialVideoCollection = this.db.collection('tutorial-videos');
                this.completeVideoCollection = this.db.collection('complete-videos');
                this.metadataCollection = this.db.collection('metadata');
                this.route.queryParams.subscribe(params => {
                  if (params.status && params.title) {
                    let allowStatus = false;
                    this.videoTypes.forEach(type => {
                      if (type.type === params.status) {
                        allowStatus = true;
                        this.videoChange(type.type);
                        this.videosDisplayed = type.type;
                      }
                    });
                    if (allowStatus) {
                      this.displayVideo(params.title);
                    } else {
                      this.resetParams();
                      this.snackbarService.showError('Invalid Params');
                    }
                  }
                });
              }

  async ngOnInit() {
    this.metadataCollection.doc('incomplete-videos').ref.onSnapshot((doc) => {
      this.incompleteVideos = doc.data().length;
      this.setNumDocs(this.videoDisplayedSubject.value);
    });
    this.metadataCollection.doc('complete-videos').ref.onSnapshot((doc) => {
      this.completeVideos = doc.data().length;
      this.setNumDocs(this.videoDisplayedSubject.value);
    });
    this.metadataCollection.doc('tutorial-videos').ref.onSnapshot((doc) => {
      this.tutorialVideos = doc.data().length;
      this.setNumDocs(this.videoDisplayedSubject.value);
    });
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => {
      this.paginator.pageIndex = 0;
      this.lastDoc = [];
    });
    this.videoDisplayedSubject.subscribe(() => {
      this.paginator.pageIndex = 0;
      this.lastDoc = [];
      this.videoTableData = [];
      this.setNumDocs(this.videoDisplayedSubject.value);
    });

    merge(this.sort.sortChange, this.paginator.page, this.videoDisplayedSubject)
      .pipe(
        switchMap(() => {
          const ascQuery = this.getQuery(this.videoDisplayedSubject.value).ref.orderBy('added', 'asc').limit(this.videosPerPage);
          const descQuery = this.getQuery(this.videoDisplayedSubject.value).ref.orderBy('added', 'desc').limit(this.videosPerPage);
          this.loading = true;
          let query = ascQuery;
          if (this.sort.direction === 'desc') {
            query = descQuery;
          }
          if (this.paginator.pageIndex !== 0 && this.lastDoc[this.paginator.pageIndex - 1]) {
            query = query.startAfter(this.lastDoc[this.paginator.pageIndex - 1]);
          }
          return query.get().catch((error) => {
            if (error.message === 'Missing or insufficient permissions.') {
              this.snackbarService.showError(error.message);
            }
            return null;
          });
        }),
        map(data => {
          this.loading = false;
          if (data) {
            this.lastDoc.push(data.docs[data.docs.length - 1]);
            return data.docs;
          }
          return data;
        }),
      ).subscribe(data => {
        if (data && this.videoDisplayedSubject.value !== 'tutorial') {
          let docData = data.map(doc => doc.data());
          docData = docData.map(doc => {
            doc.date = new Date(doc.date).toLocaleDateString();
            if (doc.raters && doc.raters.length !== 0) {
              doc.status = `${ doc.raters.length } Rating`;
              if (doc.raters.length !== 1) {
                doc.status += 's';
              }
            } else {
              doc.status = 'No Ratings';
            }
            return doc;
          });
          this.videoTableData = docData as VideoMetadata[];
        } else {
          let docData = data.map(doc => doc.data());
          this.videoTableData = docData as VideoMetadata[];
        }
      });
  }

  setNumDocs(value) {
    switch (value) {
      case 'incomplete':
        this.numDocs = this.incompleteVideos;
        break;
      case 'complete':
        this.numDocs = this.completeVideos;
        break;
      default:
        this.numDocs = this.tutorialVideos;
        break;
    }
  }

  getQuery(value) {
    switch (value) {
      case 'incomplete':
        return this.incompleteVideoCollection;
      case 'complete':
        return this.completeVideoCollection;
      default:
        return this.tutorialVideoCollection;
    }
  }

  videoChange(value) {
    this.videoDisplayedSubject.next(value);
  }

  addVideo() {
    const dialogRef = this.dialog.open(AddVideoDialogComponent, {
      disableClose: true,
      width: '500px',
      data: {
        role: this.role,
        status: this.videosDisplayed,
        // tutorial: this.videosDisplayed === 'tutorial',
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.status && result.status === 'complete') {
       // this.loadVideos();
      }
    });
  }

  deleteVideoButton(video: VideoMetadata) {
    const dialogRef = this.dialog.open(DialogConfirmationComponent, {
      width: '500px',
      data: {
        options: [
          'Confirm', 'Cancel',
        ],
        message: `Delete video ${ video.title }?`
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'Confirm') {
        this.deleteVideo(video);
      }
    });
  }

  async resetVideo(title: string) {
    try {
      this.loading = true;
      await this.videoService.resetVideo({ title });
      this.videoChange(this.videoDisplayedSubject.value);
    } catch (err) {
      console.log(err);
    } finally {
      this.loading = true;
    }
  }

  async deleteVideo(video: VideoMetadata) {
    try {
      this.loading = true;
      await this.videoService.deleteVideo({ title: video.title });
      this.videoChange(this.videoDisplayedSubject.value);
    } catch (err) {
      console.log(err);
    } finally {
      this.loading = true;
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

  async displayVideo(title: string) {
    try {
      this.loading = true;
      const video = await this.getQuery(this.videoDisplayedSubject.value).doc(title).ref.get();
      this.expandVideoData(video.data() as VideoMetadata);
    } catch (err) {
        console.log(err);
    } finally {
      this.loading = false;
    }
  }

  expandVideoData(video: VideoMetadata) {
    this.addParams(video.title);
    const dialogRef = this.dialog.open(ExpandVideoDialogComponent, {
      width: '800px',
      data: {
        video,
        type: this.videoDisplayedSubject.value,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.action && result.action  === 'closed') {
        this.resetParams();
      }
    });
  }

  addParams(title) {
    const safeTitle = title.replace('%', '%25');
    window.history.replaceState({}, '', `/admin/videos/?status=${ this.videoDisplayedSubject.value }&title=${ safeTitle }`);
  }

  resetParams() {
    window.history.replaceState({}, '', `/admin/videos`);
  }
}
