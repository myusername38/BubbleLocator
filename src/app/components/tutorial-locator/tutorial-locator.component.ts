import { Component, OnInit, Renderer2, ViewChild, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogConfirmationComponent } from '../../dialogs/dialog-confirmation/dialog-confirmation.component';
import { ReviewQualityDialogComponent } from '../../dialogs/review-quality-dialog/review-quality-dialog.component';
import { ResolutionDialogComponent } from '../../dialogs/resolution-dialog/resolution-dialog.component';
import { Bubble } from '../../interfaces/bubble';
import { MatSliderChange } from '@angular/material/slider';
import { VideoService } from '../../services/video.service';
import { TutorialVideoData } from '../../interfaces/tutorial-video-data';
import { ReviewVideoData } from '../../interfaces/review-video-data';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AuthService } from '../../services/auth.service';
import { VideoMetadata } from 'src/app/interfaces/video-metadata';
import { SnackbarService } from '../../services/snackbar.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatVideoComponent } from 'mat-video/lib/video.component';
import { TutorialResultsDialogComponent } from '../../dialogs/tutorial-results-dialog/tutorial-results-dialog.component';

export interface DialogData {
  frame: number;
}
export interface FrameLocations {
  frameSlot: number;
  time: number;
}

@Component({
  selector: 'app-tutorial-locator',
  templateUrl: './tutorial-locator.component.html',
  styleUrls: ['./tutorial-locator.component.scss']
})
export class TutorialLocatorComponent implements OnInit {

  @ViewChild('video', { static: false }) matVideo: MatVideoComponent;
  incompleteVideoCollection: AngularFirestoreCollection<VideoMetadata>;
  video: HTMLVideoElement;
  tutorialVideo: TutorialVideoData = { title: '', url: '', fps: 0, noBubbles: false, washOut: false, badQuality: false };
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
              private route: ActivatedRoute,
              private videoService: VideoService,
              private snackbarService: SnackbarService,
              private authService: AuthService,
              private db: AngularFirestore ) {
                this.incompleteVideoCollection = this.db.collection('incomplete-videos');
              }

  ngOnInit() {
    this.checkWindow();
    this.getVideoUrl();
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
    this.video.src = this.tutorialVideo.url;
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
      this.widthOffset = Math.floor((window.innerWidth - this.videoWidth) / 2);
      this.generateFrameButtons();
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
          if (this.tutorialVideo.badQuality || this.tutorialVideo.noBubbles || this.tutorialVideo.washOut) {
            this.oneTimeThrough = true;
            this.snackbarService.showError('Incorrect quality please try again', 'Close');
          } else {
            this.firstPass = false;
          }
          this.video.currentTime = 0;
          break;
        case 'Back':
          this.video.currentTime = 0;
          this.oneTimeThrough = true;
          break;
        case 'Bad Quality':
          if (this.tutorialVideo.badQuality) {
            this.firstPass = false;
            this.video.currentTime = 0;
          } else {
            this.oneTimeThrough = true;
            this.snackbarService.showError('Incorrect quality please try again', 'Close');
          }
          break;
        case 'Wash-Out':
          if (this.tutorialVideo.washOut) {
            this.firstPass = false;
            this.video.currentTime = 0;
          } else {
            this.oneTimeThrough = true;
            this.snackbarService.showError('Incorrect quality please try again', 'Close');
          }
          break;
        case 'No Bubbles':
          if (this.tutorialVideo.noBubbles) {
            this.firstPass = false;
            this.video.currentTime = 0;
          } else {
            this.oneTimeThrough = true;
            this.snackbarService.showError('Incorrect quality please try again', 'Close');
          }
          break;
        default:
          this.video.currentTime = 0;
          this.oneTimeThrough = true;
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
      case 'Wash-Out':
        bubbleToAdd = {
          x: -1,
          y: -1,
          frame: -1,
          time: -1,
        };
        break;
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

  async getVideoUrl() {
    try {
      this.loading = true;
      this.tutorialVideo = await this.videoService.getTutorialVideo();
      console.log(this.tutorialVideo);
      this.setVideoPlayer();
    } catch (err) {
      if (err.error && err.error.message === 'No more videos to review') {
        this.snackbarService.showError(err.error.message);
        this.router.navigate(['/home']);
      } else {
        console.log(err);
      }
    } finally {
      this.loading = false;
    }
  }

  getCurrentFrame() {
    return Math.floor(this.video.currentTime * this.tutorialVideo.fps); /* fix this with the actual framerate */
  }

  getFrame(time) {
    return Math.floor(time * this.tutorialVideo.fps);  /* fix this eventually */
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
    if (this.bubbles.length >= 8 || option !== 'Good') {
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

  async submit() {
    if (this.loading === true) {
      return;
    }
    try {
      this.loading = true;
      localStorage.completedFirst = true;
      const response = await this.videoService.addTutorialRating({ title: this.tutorialVideo.title, average: this.getAverage() });
      this.dialog.open(TutorialResultsDialogComponent, {
        width: '600px',
        data: {
          count: response.count,
          toPass: response.toPass,
          accepted: response.accepted
        }
      });
      if (response.message === 'Tutorial completed') {
        this.authService.updateCustomClaims();
        this.router.navigate(['/home']);
      } else {
        this.router.navigate(['/tutorial']);
      }
    } catch (err) {
      console.log(err);
    } finally {
      this.loading = false;
    }
  }

  getAverage() {
    let bubbles = 0;
    const frames = this.bubbles.length;
    const bubbleArray: Bubble[] = [];
    this.bubbles.forEach(frame => {
      frame.bubbles.forEach(bubble => {
        if (bubble.x !== -2) {
          bubbles++;
        }
        bubbleArray.push(bubble);
      });
    });
    if (bubbleArray[0].time < 0) {
      return bubbleArray[0].x;
    } else {
      return bubbles / frames;
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

  /*Note: the -13 is to make the 'X' at the right position */
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

  getFilteredCurrentFrameBubbles() { // keep all the no bubbles from showing
    return this.currentFrameBubbles.filter(b => b.x !== -2 && b.y !== -2);
  }
}
