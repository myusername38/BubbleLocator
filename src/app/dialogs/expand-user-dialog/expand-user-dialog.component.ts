import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserData } from '../../interfaces/user-data';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserService } from '../../services/user.service';

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
    private userService: UserService,
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

  close(action = 'closed') {
    this.dialogRef.close({ action, uid: this.user.uid });
  }

  async skipTutorial() {
    try {
      await this.userService.skipTutorial(this.user.uid);
    } catch (err) {
      console.log(err);
    }
  }

  getRating(userRating) {
    if (!userRating) {
      return;
    }
    if (userRating.length === 1) {
      const bubble = userRating[0];
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
      }
      return '';
    }
    const frames = [];
    let emptyFrames = 0;
    userRating.forEach(bubble => {
      if (!frames.includes(bubble.frame)) {
        frames.push(bubble.frame);
        if (bubble.x === -2 && bubble.y === -2) {
          emptyFrames += 1;
        }
      }
    });
    const average = (userRating.length - emptyFrames) / frames.length;
    return average;
  }

  viewVideoRating(title: string) {
    const queryParams = { collection: 'rejected', title , user: this.user.uid, type: 'user' };
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
