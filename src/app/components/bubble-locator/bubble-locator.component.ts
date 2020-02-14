import { Component, OnInit, Renderer2, ViewChild, Inject, HostListener } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { MatVideoComponent } from 'mat-video';
import { DialogConfirmationComponent } from '../dialog-confirmation/dialog-confirmation.component';
import { Bubble } from '../../interfaces/bubble';
import { MatSliderChange } from '@angular/material';
import { VideoService } from '../../services/video.service';

export interface DialogData {
  frame: number;
}
export interface FrameLocations {
  frameSlot: number;
  time: number;
}

@Component({
  selector: 'app-bubble-locator',
  templateUrl: './bubble-locator.component.html',
  styleUrls: ['./bubble-locator.component.scss']
})
export class BubbleLocatorComponent implements OnInit {

  @ViewChild('video', { static: true }) matVideo: MatVideoComponent;
  video: HTMLVideoElement;
  videoUrl = '';
  bubbleRadius = 12;
  frameOptions = 'Good';
  options = ['Good', 'Wash-Out', 'No Bubbles'];
  fps = 0;
  frame = 0;
  count = 0;
  videoBadQaulity = false;
  frameCount = 10;
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
  selectedColor = '#ff0022';
  playbackSpeed = 100;
  scaled = false;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.widthOffset = Math.ceil((window.innerWidth - this.videoWidth) / 2);
    this.bubbles = [...this.bubbles];
  }

  constructor(private renderer: Renderer2, public dialog: MatDialog, private videoService: VideoService) { }

  ngOnInit(): void {
    this.video = this.matVideo.getVideoTag();
    this.getVideoUlr();
    this.renderer.listen(this.video, 'ended', () => console.log('video ended'));
    this.video.addEventListener('ended', () => console.log('video ended'));
    this.video.addEventListener('pause', (e) => { this.paused = true; });
    this.video.addEventListener('clicked', (e) => { e.preventDefault(); });
    this.video.addEventListener('canplay', (e) => {
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

  async getVideoUlr() {
    try {
      this.loading = true;
      const result = await this.videoService.getVideoLink();
      this.videoUrl = result.url;
    } catch (err) {
      console.log(err);
    } finally {
      this.loading = false;
    }
  }

  getCurrentFrame() {
    return Math.floor(this.video.currentTime * 30);
  }

  getFrame(time) {
    return Math.floor(time * 30);
  }

  locateBubbles() {
    this.edited = false;
    this.deletingBubbles = false;
    this.video.pause();
    this.widthOffset = Math.floor((window.innerWidth - this.videoWidth) / 2);
    this.locatingBubbles = true;
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
      if (this.currentFrameBubbles && this.currentFrameBubbles[0]) {
        switch (this.currentFrameBubbles[0].x) {
          case -1 :
            this.frameOptions = 'Wash-Out';
            this.currentFrameBubbles = [];
            break;
          case -2 :
            this.frameOptions = 'No Bubbles';
            this.currentFrameBubbles = [];
            break;
          default:
            this.frameOptions = 'Good';
            break;
        }
      }
      if (this.scaled && this.frameOptions === 'Good') {
        this.currentFrameBubbles = this.currentFrameBubbles.map(bubble => {
          if (bubble.x >= 0) {
            return bubble;
          }
          return (
            {
              x: bubble.x / 2,
              y: bubble.y / 2,
              frame: b.frame,
            }
          );
        });
      }
    }
  }

  frameCompleted() {
    switch (this.frameOptions) {
      case 'Wash-Out':
        this.whiteWashed();
        break;
      case 'No Bubbles':
        this.noBubbles();
        break;
      default:
        this.doneLocatingBubbles();
        break;
    }
  }

  submit() {
    if (this.bubbles.length >= 8 || this.videoBadQaulity) {
      console.log(this.bubbles);
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

  noBubbles() {
    const bubble: Bubble = {
      x: -2,
      y: -2,
      frame: this.getCurrentFrame()
    };
    this.currentFrameBubbles = [];
    this.currentFrameBubbles.push(bubble);
    this.doneLocatingBubbles();
  }

  badQuality() {
    const bubble: Bubble = {
      x: -3,
      y: -3,
      frame: 0
    };

    const dialogRef = this.dialog.open(DialogConfirmationComponent, {
      width: '500px',
      data: {
        frame: this.getCurrentFrame(),
        options: [
          'Confirm', 'Cancel'
        ],
        message: `Confirm bad Quality`
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'Confirm') {
        this.bubbles = [{ frame: 0, bubbles: [bubble] }];
        this.videoBadQaulity = true;
        this.generateFrameButtons();
        this.submit();
      }
    });
  }

  whiteWashed() {
    const bubble: Bubble = {
      x: -1,
      y: -1,
      frame: this.getCurrentFrame()
    };
    this.currentFrameBubbles = [];
    this.currentFrameBubbles.push(bubble);
    this.doneLocatingBubbles();
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
          this.frameCompleted();
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
        message: `Delete Frame ${ this.getFrame(time) }?`
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'Delete') {
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
          frame: this.getCurrentFrame()
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
}
