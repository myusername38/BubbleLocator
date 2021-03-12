import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ResolutionDialogComponent } from '../../dialogs/resolution-dialog/resolution-dialog.component';
import { Bubble } from '../../interfaces/bubble';
import { MatSliderChange } from '@angular/material/slider';
import { VideoService } from '../../services/video.service';
import { ReviewVideoData } from '../../interfaces/review-video-data';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { VideoMetadata } from 'src/app/interfaces/video-metadata';
import { SnackbarService } from '../../services/snackbar.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatVideoComponent } from 'mat-video/lib/video.component';

export interface DialogData {
  frame: number;
}
export interface FrameLocations {
  frameSlot: number;
  time: number;
}

@Component({
  selector: 'app-review-rating',
  templateUrl: './review-rating.component.html',
  styleUrls: ['./review-rating.component.scss']
})
export class ReviewRatingComponent implements OnInit {

  @ViewChild('video', { static: true }) matVideo: MatVideoComponent;
  incompleteVideoCollection: AngularFirestoreCollection<VideoMetadata>;
  video: HTMLVideoElement;
  reviewVideo: ReviewVideoData = { title: '', url: '', fps: 0 };
  bubbleRadius = 12;
  frame = 0;
  count = 0;
  paused = false;
  loading = false;
  locatingBubbles = false;
  widthOffset = 0;
  heightOffset = 85 + 16;
  videoHeight = 450;
  videoWidth = 600;
  bubbles: { frame: number, bubbles: Bubble[] }[] = [];
  currentFrameBubbles: Bubble[] = [];
  times = [];
  frameLocations: FrameLocations[] = [];
  edited = false;
  colors = [
    '#ff0022',
    '#27e002',
    '#0fd6f5',
    '#eff540',
  ];
  selectedColor = this.colors[0];
  playbackSpeed = 100;
  scaled = false;
  canPlay = false;
  rating = '';
  uid = '';
  date: Date = null;
  showFrames = false;
  type = '';
  collection = '';
  title = '';
  invalidDialog = null;
  videoQueryData = null;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.checkWindow();
    this.widthOffset = Math.ceil((window.innerWidth - this.videoWidth) / 2);
    this.bubbles = [...this.bubbles];
  }

  constructor(
              public dialog: MatDialog,
              private router: Router,
              private route: ActivatedRoute,
              private videoService: VideoService,
              private snackbarService: SnackbarService,
              private db: AngularFirestore ) {
                this.incompleteVideoCollection = this.db.collection('incomplete-videos');
                console.log('here')
                this.route.queryParams.subscribe(params => {
                  if (params.user && params.title && params.type) {
                    this.videoQueryData = { title: params.title, user: params.user, type: params.type };
                    this.uid = params.user;
                    this.type = params.type;
                    this.collection = params.collection;
                    this.title = params.title;

                    if (this.collection !== 'rejected') {
                      this.getVideoUrl(this.videoQueryData);
                    } else {
                      this.getVideoRejected(this.title, this.uid);
                    }
                  } else {
                    this.returnToVideos();
                  }
                });
              }

  ngOnInit() {
    this.checkWindow();
    console.log();

  }

  checkWindow() {
    if ((window.innerWidth < 1280 || window.innerHeight < 720) && !this.invalidDialog) {
      this.invalidDialog =  this.dialog.open(ResolutionDialogComponent, {
        disableClose: true,
        width: '600px',
      });
    } else if (window.innerWidth >= 1280 && window.innerHeight >= 720 && this.invalidDialog) {
      this.invalidDialog.close();
      this.invalidDialog = null;
    }
  }

  setVideoPlayer() {
    this.video = this.matVideo.getVideoTag();
    this.video.src = this.reviewVideo.url;
    this.video.addEventListener('pause', (e) => { this.paused = true; });
    this.video.addEventListener('clicked', (e) => { e.preventDefault(); });
    this.video.addEventListener('canplay', (e) => {
      this.canPlay = true;
      this.videoWidth = this.video.videoWidth;
      this.videoHeight = this.video.videoHeight;
      if (this.videoHeight > 600 || this.videoWidth > 1000) {
        this.videoHeight = this.videoHeight / 2;
        this.videoWidth = this.videoWidth / 2;
        this.scaled = true;
      }
      this.widthOffset = Math.floor((window.innerWidth - this.videoWidth) / 2);
      this.generateFrameButtons();
    });
  }

  async getVideoUrl(videoQueryData: { title: string, user: string, type: string } = null) {
    try {
      this.loading = true;
      const video = (await this.db.doc(`/videos/${ videoQueryData.title }`).ref.get()).data();
      const data = (await this.db.doc(`/${ video.location }/${ videoQueryData.title }`).ref.get()).data();
      this.reviewVideo = { title: data.title, url: data.url, fps: data.fps };
      this.viewRating(data.ratings[videoQueryData.user].rating);
      this.rating = this.getRating(data.ratings[videoQueryData.user].rating);
      this.date = new Date(data.ratings[videoQueryData.user].added);
      this.setVideoPlayer();
    } catch (err) {
      if (err.error && err.error.message === 'No more videos to review') {
        this.snackbarService.showError(err.error.message);
      } else {
        console.log(err);
      }
    } finally {
      this.loading = false;
    }
  }

  async getVideoRejected(title: string, user: string) {
    try {
      this.loading = true;
      const videoData = (await this.db.doc(`/videos/${ title }`).ref.get()).data();
      const reviewer = (await this.db.doc(`/users/${ user }`).ref.get()).data();
      if (!videoData) {
        this.closeWithMessage('Video does not exist');
        return;
      }
      const viewRating = reviewer.rejectedRatings.filter(rating => rating.video === title);
      if (viewRating.length < 1) {
        this.closeWithMessage('User did not review video');
        return;
      }
      this.reviewVideo = { title, url: videoData.url, fps: videoData.fps };
      this.rating = this.getRating(viewRating[0].rating);
      this.viewRating(viewRating[0].rating);
      this.setVideoPlayer();
    } catch (err) {
      console.log(err);
    } finally {
      this.loading = false;
    }
  }

  closeWithMessage(message: string) {
    this.snackbarService.showError(message, 'Close');
    if (this.collection !== 'rejected') {
      this.returnToVideos();
    } else {
      this.returnToUsers();
    }
  }

  viewRating(bubbles: Bubble[]) {
    const frames = [];
    bubbles.forEach(b => {
      if (!frames.includes(b.frame)) {
        frames.push(b.frame);
        this.times.push(b.time);
      }
    });
    this.bubbles = frames.map(f => {
      return {
        frame: f,
        bubbles: bubbles.filter(b => b.frame === f),
      };
    });
  }

  getCurrentFrame() {
    return Math.floor(this.video.currentTime * this.reviewVideo.fps); /* fix this with the actual framerate */
  }

  getFrame(time) {
    return Math.floor(time * this.reviewVideo.fps);  /* fix this eventually */
  }

  locateBubbles() {
    this.locatingBubbles = true;
    this.edited = false;
    this.video.pause();
    this.frame = this.getCurrentFrame();
    const b = this.bubbles.find(f => f.frame === this.getCurrentFrame());
    if (!b) {
      this.bubbles.push({
        frame: this.getCurrentFrame(),
        bubbles: []
      });
      this.currentFrameBubbles = this.bubbles.find(f => f.frame === this.getCurrentFrame()).bubbles;
    } else {
      this.currentFrameBubbles = b.bubbles;
      if (this.scaled) {
        this.currentFrameBubbles = this.currentFrameBubbles.map(bubble => {
          if (bubble.x >= 0) {
            return bubble;
          }
          return (
            {
              x: bubble.x / 2,
              y: bubble.y / 2,
              frame: b.frame,
              time: bubble.time,
            }
          );
        });
      }
    }
  }

  setFrame(time) {
    this.video.currentTime = time;
    this.locateBubbles();
  }

  doneLocatingBubbles() {
    this.currentFrameBubbles = [];
    this.locatingBubbles = false;
  }

  generateFrameButtons() {
    this.times = this.times.sort((a, b) => a - b );
    let end = 10;
    if (this.times.length <= 12 && this.times.length >= 10) {
      end = this.times.length;
    }
    for (let i = 0; i < end; i++) {
      let time = -1;
      if (i < this.times.length) {
        time = this.times[i];
      }
      this.frameLocations[i] = {
        frameSlot: i,
        time
      };
    }
  }

  returnToVideos() {
    const queryParams = { status: this.collection, title: this.title };
    this.router.navigate(['/admin/videos'], { queryParams });
  }

  returnToUsers() {
    this.router.navigate(['/admin/users']);
    const queryParams = { uid: this.uid };
    this.router.navigate(['/admin/users'], { queryParams });
  }

  setPlaybackSpeed(event: MatSliderChange) {
    this.playbackSpeed = event.value;
    this.video.playbackRate = (this.playbackSpeed / 100);
  }

  getX(bubble) {
    let x = bubble.x;
    if (this.scaled) {
      x = x / 2;
    }
    return x - 13 + this.widthOffset;
  }

  getY(bubble) {
    let y = bubble.y;
    if (this.scaled) {
      y = y / 2;
    }
    return y - 13 + this.heightOffset;
  }

  getRating(bubbles: Bubble[]) {
    if (!bubbles) {
      return;
    }
    if (bubbles.length === 1) {
      const bubble = bubbles[0];
      let rating = '';
      if (bubble.x === -1 && bubble.y) {
        rating = 'Wash-out';
      } else if (bubble.x === -2 && bubble.y === -2) {
        rating = 'No Bubbles';
      } else if (bubble.x === -3 && bubble.y === -3) {
        rating = 'Bad Quality';
      }
      return rating;
    }
    const frames = [];
    bubbles.forEach(bubble => {
      if (!frames.includes(bubble.frame)) {
        frames.push(bubble.frame);
      }
    });
    this.showFrames = true;
    const average = bubbles.length / frames.length;
    return `Average: ${ Math.round(average * 100) / 100 }`;
  }

  async deleteVideoRating() {
    try {
      this.loading = true;
      await this.videoService.deleteVideoRating({ title: this.title, uid: this.uid, location: this.collection });
      this.returnToVideos();
    } catch (err) {
      console.log(err);
    } finally {
      this.loading = false;
    }
  }

  getFilteredCurrentFrameBubbles() {
    return this.currentFrameBubbles.filter(b => b.x !== -2 && b.y !== -2);
  }
}
