import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-expand-video-dialog',
  templateUrl: './expand-video-dialog.component.html',
  styleUrls: ['./expand-video-dialog.component.scss']
})
export class ExpandVideoDialogComponent {

  videoData = null;
  videoType = '';
  title = '';
  raters = [];
  displayedColumns: string[] = ['user', 'rating', 'date', 'expand'];

  constructor(
    public dialogRef: MatDialogRef<ExpandVideoDialogComponent>,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data) {
      this.videoData = data.video;
      this.videoType = data.type;
      this.raters = data.raters;
    }

  onNoClick(): void {
    this.dialogRef.close();
  }

  click(result) {
    this.dialogRef.close(result);
  }

  close() {
    this.dialogRef.close();
  }

  getRating(user) {
    const userRating = this.videoData.ratings[user];
    if (!userRating) {
      return;
    }
    if (userRating.rating.length === 1) {
      const bubble = userRating.rating[0];
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
    userRating.rating.forEach(bubble => {
      if (!frames.includes(bubble.frame)) {
        frames.push(bubble.frame);
      }
    });
    const average = userRating.rating.length / frames.length;
    return average;
  }

  viewVideoRating(user: string) {
    const queryParams = { collection: this.videoType, title: this.videoData.title, user };
    this.router.navigate(['bubbleLocator/review-rating'], { queryParams });
    this.close();
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

  getDate(date) {
    return new Date(date).toLocaleDateString();
  }
}
