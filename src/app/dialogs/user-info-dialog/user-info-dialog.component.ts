import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from '../../services/auth.service';

interface UserMetaData {
  role: string;
  userScore: number;
  videosReviewed: number;
  accepted: number;
  outliers: number;
}

@Component({
  selector: 'app-user-info-dialog',
  templateUrl: './user-info-dialog.component.html',
  styleUrls: ['./user-info-dialog.component.scss']
})

export class UserInfoDialogComponent implements OnInit {

  loading = false;
  user: UserMetaData = null;

  constructor(
    public dialogRef: MatDialogRef<UserInfoDialogComponent>,
    private authService: AuthService,
    private db: AngularFirestore,
    @Inject(MAT_DIALOG_DATA) public data) {}

  ngOnInit() {
    this.loadUser();
  }

  async loadUser() {
    try {
      this.loading = true;
      this.user = (await this.db.doc(`/users/${ this.authService.uid }`).ref.get()).data() as UserMetaData;
    } catch (err) {
      console.log(err);
    } finally {
      this.loading = false;
    }
  }

  onNoClick(): void {
    this.dialogRef.close({ action: 'closed' });
  }

  click(result) {
    this.dialogRef.close({ action: 'closed' });
  }

  deleteAccount() {
    this.dialogRef.close({ action: 'delete' });
  }

  logoutAccount() {
    this.dialogRef.close({ action: 'logout' });
  }

  close(action = 'closed') {
    this.dialogRef.close({ action });
  }

  getDate(date) {
    return new Date(date).toLocaleDateString();
  }
}
