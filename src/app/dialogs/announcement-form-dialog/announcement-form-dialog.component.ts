import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { AngularFirestore, DocumentData } from '@angular/fire/firestore';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-announcement-form-dialog',
  templateUrl: './announcement-form-dialog.component.html',
  styleUrls: ['./announcement-form-dialog.component.scss']
})
export class AnnouncementFormDialogComponent implements OnInit {

  announcementDoc: DocumentData = null;
  dateNow = Date.now();
  loading = false;
  announcementForm: FormGroup;
  expireDates = [
    { date: 8, title: '8 Hours' },
    { date: 24, title: '1 Day' },
    { date: 48, title: '2 Days' },
    { date: -1, title: 'Custom' },
  ];
  expireDate = this.expireDates[0].date;
  userEnteredDate = 0;
  title = '';
  expire = this.expireDate;
  announcement = '';
  customExpire = 0;
  buttonMessage = 'Post';

  constructor(
  public dialogRef: MatDialogRef<AnnouncementFormDialogComponent>,
  private snackbarService: SnackbarService,
  private authService: AuthService,
  private db: AngularFirestore,
  @Inject(MAT_DIALOG_DATA) public data) {
    if (data) {
      this.announcementDoc = data;
      this.buttonMessage = 'Update';
      this.announcementDoc = data;
      this.title = data.data().title;
      this.expire = -1;
      this.expireDate = -1;
      this.announcement = data.data().announcement;
      this.customExpire = this.numHoursInFuture(data.data().expire);
    }
  }

  ngOnInit(): void {
    this.announcementForm = new FormGroup({
      title: new FormControl(this.title, [Validators.required]),
      announcement: new FormControl(this.announcement, [Validators.required]),
      expire: new FormControl(this.expireDate, [Validators.required]),
      customExpire: new FormControl(this.customExpire),
    });
  }

  numHoursInFuture(date: number) {
    if (date < Date.now()) {
      return 0;
    } else {
      return Math.floor(Math.abs(date - Date.now()) / 36e5);
    }
  }

  getFutureDate(hours: number) {
    return Date.now() + (hours * 60 * 60 * 1000);
  }

  async onSubmit() {
    try {
      this.loading = true;
      const docToAdd = this.announcementForm.getRawValue();
      docToAdd.added = Date.now();
      let futureDate = 0;
      if (this.expireDate === -1) {
        futureDate = this.announcementForm.getRawValue().customExpire;
      } else {
        futureDate = this.expireDate;
      }
      delete docToAdd.customExpire;
      docToAdd.expire = this.getFutureDate(futureDate);
      docToAdd.author = this.authService._user.uid;
      if (this.announcementDoc) {
        await this.announcementDoc.ref.set(docToAdd);
      } else {
        await this.db.collection('announcements').add(docToAdd);
      }
      this.close();
    } catch (err) {
      console.log(err);
    } finally {
      this.loading = false;
    }
  }

  expireDateChange(newDate) {
    this.expireDate = newDate;
  }

  close() {
    this.dialogRef.close();
  }
}
