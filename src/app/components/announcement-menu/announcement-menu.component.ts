import { Component, OnInit } from '@angular/core';
import { AngularFirestore, DocumentData } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { Announcement } from '../../interfaces/announcement';
import { DialogConfirmationComponent } from '../../dialogs/dialog-confirmation/dialog-confirmation.component';
import { AnnouncementFormDialogComponent } from '../../dialogs/announcement-form-dialog/announcement-form-dialog.component';

@Component({
  selector: 'app-announcement-menu',
  templateUrl: './announcement-menu.component.html',
  styleUrls: ['./announcement-menu.component.scss']
})
export class AnnouncementMenuComponent implements OnInit {

  loading = false;
  announcements: DocumentData[] = [];

  constructor(private db: AngularFirestore, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.loading = true;
    this.db.collection('announcements').ref.orderBy('added', 'desc').onSnapshot(data => {
      this.announcements = [];
      data.forEach(doc => {
        this.announcements.push(doc);
      });
      this.loading = false;
    });
  }

  makeAnnouncement() {
    const dialogRef = this.dialog.open(AnnouncementFormDialogComponent, {
      disableClose: true,
      width: '1000px',
      maxHeight: '90vh',
      data: null,
    });
    dialogRef.afterClosed().subscribe(result => {
        // do something
    });
  }

  editDoc(announcementDoc: DocumentData) {
    const dialogRef = this.dialog.open(AnnouncementFormDialogComponent, {
      disableClose: true,
      width: '1000px',
      maxHeight: '90vh',
      data: announcementDoc,
    });
    dialogRef.afterClosed().subscribe(result => {
        // do something
    });
  }

  async deleteDoc(announcementDoc: DocumentData) {
    try {
      this.loading = true;
      await announcementDoc.ref.delete();
    } catch (err) {
      console.log(err);
    } finally {
      this.loading = false;
    }
  }

  getAnnoucement(announcementDoc: DocumentData) {
    const announcement = (announcementDoc.data() as Announcement).announcement;
    return announcement.replace(/\n/g, '<br />');
  }

  getTitle(announcementDoc: DocumentData) {
    return (announcementDoc.data() as Announcement).title;
  }
}
