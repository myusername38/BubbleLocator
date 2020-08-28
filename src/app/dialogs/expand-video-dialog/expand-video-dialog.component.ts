import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { VideoService } from '../../services/video.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-expand-video-dialog',
  templateUrl: './expand-video-dialog.component.html',
  styleUrls: ['./expand-video-dialog.component.scss']
})
export class ExpandVideoDialogComponent {

  loading = false;
  videoData = null;
  videoType = '';
  title = '';
  raters = [];
  displayedColumns: string[] = ['user', 'rating', 'date', 'expand'];
  role = '';

  constructor(
    public dialogRef: MatDialogRef<ExpandVideoDialogComponent>,
    private videoService: VideoService,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data) {
      this.videoData = data.video;
      this.videoType = data.type;
      this.raters = data.raters;
      this.role = data.role;
    }

  onNoClick(): void {
    this.dialogRef.close({ action: 'closed' });
  }

  click(result) {
    this.dialogRef.close({ action: 'closed' });
  }

  close() {
    this.dialogRef.close({ action: 'closed' });
  }

  getRating(user) {
    const userRating = this.videoData.ratings[user];
    if (!userRating) {
      return;
    }
    if (userRating.rating.length === 1) {
      const bubble = userRating.rating[0];
      let rating = '';
      if (bubble.frame === -1) {
        if (bubble.x === -1 && bubble.y === -1) {
          rating = 'Wash-out';
        } else if (bubble.x === -2 && bubble.y === -2) {
          rating = 'No Bubbles';
        } else if (bubble.x === -3 && bubble.y === -3) {
          rating = 'Bad Quality';
        }
        return rating;
      } else {
        return '';
      }
    }
    const frames = [];
    let emptyFrames = 0;
    userRating.rating.forEach(bubble => {
      if (!frames.includes(bubble.frame)) {
        frames.push(bubble.frame);
      }
      if (bubble.x === -2 && bubble.y === -2) {
        emptyFrames += 1;
      }
    });
    const average = (userRating.rating.length - emptyFrames) / frames.length;
    return average.toFixed(2);
  }

  viewVideoRating(user: string) {
    const queryParams = { collection: this.videoType, title: this.videoData.title, user, type: 'video' };
    this.router.navigate(['bubbleLocator/review-rating'], { queryParams });
    this.dialogRef.close({ action: 'viewed' });
  }

  getDateFromUser(user) {
    let date = this.videoData.ratings[user];
    if (date) {
      date = date.added;
    } else {
      return;
    }
    return new Date(date).toLocaleDateString();
  }

  async deleteVideoRating(rater: string) {
    try {
      this.loading = true;
      await this.videoService.deleteVideoRating({ title: this.videoData.title, uid: rater, location: this.videoType });
      this.videoData.raters = this.videoData.raters.filter(r => r !== rater);
    } catch (err) {
      console.log(err);
    } finally {
      this.loading = false;
    }
  }

  getDate(date) {
    return new Date(date).toLocaleDateString();
  }
}
