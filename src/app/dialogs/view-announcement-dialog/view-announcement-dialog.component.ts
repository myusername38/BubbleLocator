import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Announcement } from '../../interfaces/announcement';

@Component({
  selector: 'app-view-announcement-dialog',
  templateUrl: './view-announcement-dialog.component.html',
  styleUrls: ['./view-announcement-dialog.component.scss']
})
export class ViewAnnouncementDialogComponent {

  announcement: Announcement = null;

  constructor(
    public dialogRef: MatDialogRef<ViewAnnouncementDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Announcement) {
      this.announcement = data;
    }

  onNoClick(): void {
    this.dialogRef.close();
  }

  close() {
    this.dialogRef.close();
  }

  dateTickFormatting(date: number) {
    return new Date(date).toLocaleDateString();
  }

  formatAnnouncement(text: string) {
    return text.replace(/\n/g, '<br />');
  }

  click(result) {
    this.dialogRef.close(result);
  }
}
