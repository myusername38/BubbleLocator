import { Component, OnInit, Renderer2, ViewChild, Inject, HostListener } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { MatVideoComponent } from 'mat-video';
import { DialogConfirmationComponent } from '../dialog-confirmation/dialog-confirmation.component';
import { Bubble } from '../../interfaces/bubble';

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
  colors = [
    '#FF6700',
    '#F4F4F8',
    '#FE4A49',
    '#20FC8F',
    '#020100'
  ];
  selectedColor = '#F4F4F8';

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

  setFrame(time) {
    this.video.currentTime = time;
    this.locateBubbles();
  }

  deleteBubble() {
    this.deletingBubbles = true;
  }

  deleteSelectedFrame(time: number) {
    this.times = this.times.filter(t =>  t !== time);
    this.bubbles = this.bubbles.filter(b => b.frame !== this.getFrame(time));
    this.generateFrameButtons();
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

  onMouseClick(e: MouseEvent) {
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
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogConfirmationComponent, {
      width: '500px',
      data: { frame: this.getCurrentFrame() }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}
