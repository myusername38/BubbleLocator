import { Component, OnInit, Renderer2, ViewChild, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogConfirmationComponent } from '../../dialogs/dialog-confirmation/dialog-confirmation.component';
import { ReviewQualityDialogComponent } from '../../dialogs/review-quality-dialog/review-quality-dialog.component';
import { ResolutionDialogComponent } from '../../dialogs/resolution-dialog/resolution-dialog.component';
import { SelectFilesDialogComponent } from '../../dialogs/select-files-dialog/select-files-dialog.component';
import { DownloadResultsDialogComponent } from '../../dialogs/download-results-dialog/download-results-dialog.component';
import { Bubble } from '../../interfaces/bubble';
import { MatSliderChange } from '@angular/material/slider';
import { VideoService } from '../../services/video.service';
import { ReviewVideoData } from '../../interfaces/review-video-data';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { VideoMetadata } from '../../interfaces/video-metadata';
import { SnackbarService } from '../../services/snackbar.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatVideoComponent } from 'mat-video/lib/video.component';
import { CompletedRatingDialogComponent } from '../../dialogs/completed-rating-dialog/completed-rating-dialog.component';


export interface DialogData {
  frame: number;
}

export interface VideoData {
  name: string;
  url: string;
}

export interface FrameLocations {
  frameSlot: number;
  time: number;
}

@Component({
  selector: 'app-local-locator',
  templateUrl: './local-locator.component.html',
  styleUrls: ['./local-locator.component.scss']
})
export class LocalLocatorComponent implements OnInit {

  @ViewChild('video') matVideo: MatVideoComponent;
  incompleteVideoCollection: AngularFirestoreCollection<VideoMetadata>;
  video: HTMLVideoElement;
  firstPass = true;
  bubbleRadius = 12;
  frameOptions = 'Good';
  frame = 0;
  count = 0;
  paused = false;
  loading = false;
  locatingBubbles = false;
  deletingBubbles = false;
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
  invalidDialog = null;
  oneTimeThrough = false;
  short = false;
  shortMinimumFrames = 3;
  regularMinimumFrames = 8;
  minimumFrames = this.regularMinimumFrames;
  currentVideo: VideoData = null;
  videoRatings: { title: string, rating: string }[] = [];
  reviewVideos: VideoData[] = [];

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    /* Note just reusing this component to make things easier */
    this.checkWindow();
    this.widthOffset = Math.ceil((window.innerWidth - this.videoWidth) / 2);
    this.bubbles = [...this.bubbles];
  }

  constructor(private renderer: Renderer2,
              public dialog: MatDialog,
              private router: Router,
              private snackbarService: SnackbarService ) { }

  ngOnInit() {
    this.checkWindow();
    this.getVideos();
  }

  getVideos() {
    const dialogRef = this.dialog.open(SelectFilesDialogComponent, {
      disableClose: true,
      width: '500px',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result)
        this.reviewVideos = result.videos;
        this.currentVideo = this.reviewVideos.pop();
        this.setVideoPlayer();
      } else {
        this.snackbarService.showError('No Files chosen')
        this.router.navigate(['home'])
      }
    });
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
  /* takes the currentVideo and sets the video player for it */
  setVideoPlayer() {
    this.video = this.matVideo.getVideoTag();
    this.video.src = this.currentVideo.url;
    this.renderer.listen(this.video, 'ended', (e) => console.log('video ended'));
    this.video.addEventListener('ended', (e) => {
      if (this.firstPass) {
        this.openReviewDialog();
      }
    });
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
      if (this.video.duration < 6) {
        this.short = true;
        this.minimumFrames = this.shortMinimumFrames;
        this.showVideoShortDialog();
      }
      this.widthOffset = Math.floor((window.innerWidth - this.videoWidth) / 2);
      this.generateFrameButtons();
    });
  }

  showVideoShortDialog() {
    const dialogRef = this.dialog.open(DialogConfirmationComponent, {
      width: '500px',
      data: {
        frame: this.getCurrentFrame(),
        options: [
          'Confirm',
        ],
        message: 'This is a short video',
        description: `This video only requires ${ this.shortMinimumFrames } frames to submit`
      }
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  openReviewDialog() {
    this.video.pause();
    const dialogRef = this.dialog.open(ReviewQualityDialogComponent, {
      disableClose: true,
      width: '500px',
    });
    dialogRef.afterClosed().subscribe(result => {
      switch (result) {
        case 'Good':
          this.firstPass = false;
          this.video.currentTime = 0;
          break;
        case 'Back':
          this.video.currentTime = 0;
          this.oneTimeThrough = true;
          break;
        default:
          const bubble = this.bubbleToAdd(result);
          if (bubble) {
            this.bubbles.push({ frame: 0, bubbles: [bubble] });
            this.submit();
          }
      }
    });
  }

  noBubblesOnFrame() {
    if (this.currentFrameBubbles[0]) {
      const dialogRef = this.dialog.open(DialogConfirmationComponent, {
        width: '500px',
        data: {
          frame: this.getCurrentFrame(),
          options: [
            'Confirm', 'Cancel'
          ],
          message: 'Confirm no bubbles on frame'
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result === 'Confirm') {
          const bubble: Bubble = {
            x: -2,
            y: -2,
            frame: this.getCurrentFrame(),
            time: this.video.currentTime,
          };
          this.currentFrameBubbles = [bubble];
          this.doneLocatingBubbles();
        }
      });
    } else {
      const bubble: Bubble = {
        x: -2,
        y: -2,
        frame: this.getCurrentFrame(),
        time: this.video.currentTime,
      };
      this.currentFrameBubbles = [bubble];
      this.doneLocatingBubbles();
    }
  }

  reassessVideoQuality() {
    this.video.pause();
    const dialogRef = this.dialog.open(ReviewQualityDialogComponent, {
      disableClose: true,
      width: '500px',
      data: {
        message: 'Reassess Video Quality'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      const bubble = this.bubbleToAdd(result);
      if (bubble && result !== 'Back' && result !== 'Good') {
        this.confirmSubmit(result, bubble);
      }
    });
  }

  bubbleToAdd(result): Bubble {
    let bubbleToAdd: Bubble = null;
    switch (result) {
      case 'No Bubbles':
        bubbleToAdd = {
          x: -2,
          y: -2,
          frame: -1,
          time: -1,
        };
        break;
      case 'Bad Quality':
        bubbleToAdd = {
          x: -3,
          y: -3,
          frame: -1,
          time: -1,
        };
        break;
    }
    return bubbleToAdd;
  }

  getCurrentFrame() {
    return Math.floor(this.video.currentTime * 30); /* fix this with the actual framerate */
  }

  getFrame(time) {
    return Math.floor(time * 30);  /* fix this eventually */
  }

  locateBubbles() {
    this.locatingBubbles = true;
    this.edited = false;
    this.deletingBubbles = false;
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

  confirmSubmit(option: string = 'Good', bubble: Bubble = null) {
    if (this.bubbles.length >= this.minimumFrames || option !== 'Good') {
      let message = 'Submit video rating';
      let description = '';
      if (option !== 'Good') {
        message = `Confirm '${ option }' rating`;
        description = 'This rating will overwrite all bubble locations';
      }
      const dialogRef = this.dialog.open(DialogConfirmationComponent, {
        width: '500px',
        data: {
          frame: this.getCurrentFrame(),
          options: [
            'Submit', 'Cancel'
          ],
          message,
          description,
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result === 'Submit') {
          if (bubble) {
            this.bubbles = [{ frame: 0, bubbles: [bubble] }];
          }
          this.submit();
        } else {
         this.snackbarService.showInfo('Video submittion canceled');
        }
      });
    }
  }

  showCompletedRatingDialog() {
    const dialogRef = this.dialog.open(CompletedRatingDialogComponent, {
      width: '550px',
      data: { }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'Continue') {
        location.reload();
      } else {
        this.router.navigate(['/home']);
        this.snackbarService.showInfo('Thank you for rating on decobubbles!');
      }
    });
  }

  async submit() {
    let currentVideoRating = '';
    if (this.bubbles.length > 1) {
      let count = 0;
      this.bubbles.forEach(frame => {
        frame.bubbles.forEach(bubble => {
          count += 1;
        });
      });
      currentVideoRating =  `${ Math.round(100 * (count / this.bubbles.length)) / 100 }`;
    } else {
      if (this.bubbles[0].bubbles[0].x === -2) {
        currentVideoRating = 'No Bubbles';
      } else {
        currentVideoRating = 'Bad Quality';
      }
    }
    this.videoRatings.push({ title: this.currentVideo.name, rating: currentVideoRating });
    if (this.reviewVideos.length >= 1) {
      this.currentVideo = this.reviewVideos.pop();
      this.resetVariables();
      this.video.src = this.currentVideo.url;
    } else {
      const dialogRef = this.dialog.open(DownloadResultsDialogComponent, {
        width: '500px',
        data: { ratings: this.videoRatings }
      });
        dialogRef.afterClosed().subscribe(result => {
      });
    }
  }

  doneLocatingBubbles() {
    this.locatingBubbles = false;
    this.deletingBubbles = false;
    this.edited = false;
    if (this.currentFrameBubbles[0]) {
      this.bubbles.find(f => f.frame === this.getCurrentFrame()).bubbles = [...this.currentFrameBubbles];
      if (!this.times.includes(this.video.currentTime)) {
        this.times.push(this.video.currentTime);
        this.generateFrameButtons();
      }
    } else {
      this.bubbles.pop(); // removing the last element if the user added no bubbles
    }
    this.currentFrameBubbles = [];
    this.frameOptions = 'Good';
  }

  setFrame(time) {
    if (this.edited) {
      const dialogRef = this.dialog.open(DialogConfirmationComponent, {
        width: '500px',
        data: {
          frame: this.getCurrentFrame(),
          options: [
            'Yes', 'No'
          ],
          message: 'Save Changes?'
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result === 'Yes') {
          this.doneLocatingBubbles();
          this.video.currentTime = time;
          this.locateBubbles();
        } else {
          this.video.currentTime = time;
          this.locateBubbles();
        }
      });
    } else {
      this.video.currentTime = time;
      this.locateBubbles();
    }
  }

  deleteBubbles() {
    this.deletingBubbles = true;
  }

  doneDeletingBubbles() {
    this.deletingBubbles = false;
  }

  deleteSelectedFrame(time: number) {
    const dialogRef = this.dialog.open(DialogConfirmationComponent, {
      width: '500px',
      data: {
        frame: this.getCurrentFrame(),
        options: [
          'Delete', 'Cancel'
        ],
        message: `Delete frame ${ this.getFrame(time) }?`,
        description: `This will delete all bubbles on frame ${ this.getFrame(time) }`
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'Delete') {
        if (this.getFrame(time) === this.getCurrentFrame()) {
          this.doneLocatingBubbles();
        }
        this.times = this.times.filter(t =>  t !== time);
        this.bubbles = this.bubbles.filter(b => b.frame !== this.getFrame(time));
        this.generateFrameButtons();
      }
    });
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

  onMouseClick(e: MouseEvent) {
    const startLen = this.currentFrameBubbles.length;
    if (this.locatingBubbles
      && e.clientX > this.widthOffset && e.clientX < this.widthOffset + this.videoWidth
      && e.clientY > this.heightOffset && e.clientY < this.heightOffset + this.videoHeight) {
      let x = e.clientX - this.widthOffset;
      let y = e.clientY - this.heightOffset;
      if (this.scaled) {
        x = x * 2;
        y = y * 2;
      }
      if (this.deletingBubbles) {
        this.currentFrameBubbles =
          this.currentFrameBubbles.filter(b => (Math.abs(x - b.x) > this.bubbleRadius || Math.abs(y - b.y) > this.bubbleRadius));
      } else {
        const bubble: Bubble = {
          x,
          y,
          frame: this.getCurrentFrame(),
          time: this.video.currentTime,
        };
        this.currentFrameBubbles.push(bubble);
      }
    }
    if (startLen !== this.currentFrameBubbles.length) {
      this.edited = true;
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogConfirmationComponent, {
      width: '500px',
      data: {
        frame: this.getCurrentFrame(),
        options: [
          'Yes', 'No'
        ],
        message: ''
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      return(result);
    });
  }

  getFilteredCurrentFrameBubbles() {
    return this.currentFrameBubbles.filter(b => b.x !== -2 && b.y !== -2);
  }

  resetVariables() {
    this.firstPass = true;
    this.frameOptions = 'Good';
    this.frame = 0;
    this.count = 0;
    this.paused = false;
    this.loading = false;
    this.locatingBubbles = false;
    this.deletingBubbles = false;
    this.widthOffset = 0;
    this.heightOffset = 85 + 16;
    this.videoHeight = 450;
    this.videoWidth = 600;
    this.bubbles = [];
    this.currentFrameBubbles = [];
    this.times = [];
    this.frameLocations = [];
    this.edited = false;
    this.scaled = false;
    this.canPlay = false;
    this.invalidDialog = null;
    this.oneTimeThrough = false;
    this.short = false;
    this.shortMinimumFrames = 3;
    this.regularMinimumFrames = 8;
    this.minimumFrames = this.regularMinimumFrames;
  }
}
