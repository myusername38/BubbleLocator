import { Component, OnInit, Renderer2, ViewChild, Inject, HostListener } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { MatVideoComponent } from 'mat-video';
import { DialogConfirmationComponent } from '../dialog-confirmation/dialog-confirmation.component';
import { Bubble } from '../../interfaces/bubble';
import { MatSliderChange } from '@angular/material';

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

  @ViewChild('video', {static: true}) matVideo: MatVideoComponent;
  video: HTMLVideoElement;
  bubbleRadius = 12;
  fps = 0;
  frame = 0;
  count = 0;
  frameCount = 10;
  paused = false;
  locatingBubbles = false;
  deletingBubbles = false;
  widthOffset = 0;
  heightOffset = 16;
  videoHeight = 450;
  videoWidth = 600;
  bubbles: { frame: number, bubbles: Bubble[] }[] = [];
  currentFrameBubbles: Bubble[] = [];
  times = [];
  frameLocations: FrameLocations[] = [];
  edited = false;
  colors = [
    '#990033',
    '#345995',
    '#32746D',
    '#EEC170',
  ];
  selectedColor = '#F4F4F8';
  playbackSpeed = 100;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.widthOffset = Math.ceil((window.innerWidth - this.videoWidth) / 2);
    this.bubbles = [...this.bubbles];
  }

  constructor(private renderer: Renderer2, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.video = this.matVideo.getVideoTag();
    this.renderer.listen(this.video, 'ended', () => console.log('video ended'));
    this.video.addEventListener('ended', () => console.log('video ended'));
    this.video.addEventListener('pause', (e) => { this.paused = true; });
    this.video.addEventListener('clicked', (e) => { e.preventDefault(); });
    this.widthOffset = Math.floor((window.innerWidth - this.videoWidth) / 2);
    this.generateFrameButtons();
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
  }

  noBubbles() {
    const bubble: Bubble = {
      x: -2,
      y: -2,
      frame: this.getCurrentFrame()
    };
    this.currentFrameBubbles.push(bubble);
    this.doneLocatingBubbles();
  }

  badQuality() {

  }

  whiteWashed() {
    const bubble: Bubble = {
      x: -1,
      y: -1,
      frame: this.getCurrentFrame()
    };
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
        message: `Delete Frame ${ this.getFrame(time) }?`
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'Delete') {
        console.log('working');
        this.times = this.times.filter(t =>  t !== time);
        this.bubbles = this.bubbles.filter(b => b.frame !== this.getFrame(time));
        this.generateFrameButtons();
      }
    });
  }

  generateFrameButtons() {
    this.times = this.times.sort((a, b) => a - b );
    for (let i = 0; i < 10; i++) {
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

  onMouseClick(e: MouseEvent) {
    const startLen = this.currentFrameBubbles.length;
    if (this.locatingBubbles
      && e.clientX > this.widthOffset && e.clientX < this.widthOffset + this.videoWidth
      && e.clientY > this.heightOffset && e.clientY < this.heightOffset + this.videoHeight) {
      const x = e.clientX - this.widthOffset;
      const y = e.clientY - this.heightOffset;
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
