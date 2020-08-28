import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatVideoComponent } from 'mat-video/lib/video.component';
import { MatSliderChange } from '@angular/material/slider';

@Component({
  selector: 'app-view-video',
  templateUrl: './view-video.component.html',
  styleUrls: ['./view-video.component.scss']
})
export class ViewVideoComponent implements OnInit {
  @ViewChild('video', { static: true }) matVideo: MatVideoComponent;

  loading = false;
  video: HTMLVideoElement;
  videoUrl = '';
  type = '';
  title = '';
  videoHeight = 450;
  videoWidth = 600;
  playbackSpeed = 100;

  constructor(private renderer: Renderer2,
              public dialog: MatDialog,
              private router: Router,
              private route: ActivatedRoute,
              private snackbarService: SnackbarService,
              private db: AngularFirestore ) {
                this.route.queryParams.subscribe(params => {
                  if (params.title) {
                    this.title = params.title;
                  } else {
                    this.returnToVideos();
                    // go back to admin page
                  }
                });
              }

  ngOnInit(): void {
    this.getVideoUrl(this.title);
  }

  setVideoPlayer() {
    this.video = this.matVideo.getVideoTag();
    this.video.src = this.videoUrl;
    this.video.addEventListener('canplay', (e) => {
      this.videoWidth = this.video.videoWidth;
      this.videoHeight = this.video.videoHeight;
      if (this.videoHeight > 600 || this.videoWidth > 1000) {
        this.videoHeight = this.videoHeight / 2;
        this.videoWidth = this.videoWidth / 2;
      }
    });
  }

  async getVideoUrl(title: string) {
    try {
      this.loading = true;
      const doc = (await this.db.doc(`/videos/${ title }`).ref.get()).data();
      this.videoUrl = doc.url;
      this.setVideoPlayer();
    } catch (err) {
      console.log(err);
    } finally {
      this.loading = false;
    }
  }

  setPlaybackSpeed(event: MatSliderChange) {
    this.playbackSpeed = event.value;
    this.video.playbackRate = (this.playbackSpeed / 100);
  }

  returnToVideos() {
    this.router.navigate(['/admin/videos']);
  }
}
