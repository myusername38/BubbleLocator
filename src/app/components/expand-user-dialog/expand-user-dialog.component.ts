import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserData } from '../../interfaces/user-data';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-expand-user-dialog',
  templateUrl: './expand-user-dialog.component.html',
  styleUrls: ['./expand-user-dialog.component.scss']
})
export class ExpandUserDialogComponent {

  user: UserData = null;
  displayedColumns: string[] = ['user', 'rating', 'date', 'expand'];

  constructor(
    public dialogRef: MatDialogRef<ExpandUserDialogComponent>,
    private router: Router,
    private db: AngularFirestore,
    @Inject(MAT_DIALOG_DATA) public data) {
      this.user = data.user;
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

  getRating(userRating) {
    if (!userRating) {
      return;
    }
    if (userRating.length === 1) {
      const bubble = userRating[0];
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
    userRating.forEach(bubble => {
      if (!frames.includes(bubble.frame)) {
        frames.push(bubble.frame);
      }
    });
    const average = userRating.length / frames.length;
    return average;
  }

  viewVideoRating(title: string) {
    const queryParams = { collection: 'incomplete', title , user: this.user.uid, type: 'user' };
    this.router.navigate(['bubbleLocator/review-rating'], { queryParams });
    this.dialogRef.close({ action: 'viewed' });
  }

  getAcceptedPercentage() {
    return '50.00%';
  }

  getDate(date) {
    return new Date(date).toLocaleDateString();
  }
}
