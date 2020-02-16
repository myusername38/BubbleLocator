import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { AddVideoDialogComponent } from '../add-video-dialog/add-video-dialog.component';
import { DialogConfirmationComponent } from '../dialog-confirmation/dialog-confirmation.component';
import { VideoService } from '../../services/video.service';
import { VideoMetadata } from '../../interfaces/video-metadata';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-video-menu',
  templateUrl: './video-menu.component.html',
  styleUrls: ['./video-menu.component.scss']
})
export class VideoMenuComponent implements OnInit {

  videoData = new MatTableDataSource<VideoMetadata>();
  loading = false;
  role = '';

  displayedColumns: string[] = ['title', 'status', 'added', 'user', 'expand'];

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(private snackbarService: SnackbarService,
              private videoService: VideoService,
              private authService: AuthService,
              private router: Router,
              public dialog: MatDialog) {
                this.authService.userRole.subscribe(role => {
                  this.role = role;
                });
              }

  ngOnInit(): void {
    this.loadVideos();
  }

  addVideo() {
    const dialogRef = this.dialog.open(AddVideoDialogComponent, {
      disableClose: true,
      width: '500px',
      data: {
        role: 'admin',
        status: 'incomplete'
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.status && result.status === 'complete') {
        this.loadVideos();
      }
    });
  }

  deleteVideoButton(video: VideoMetadata) {
    const dialogRef = this.dialog.open(DialogConfirmationComponent, {
      width: '500px',
      data: {
        options: [
          'Confirm', 'Cancel',
        ],
        message: `Delete video ${ video.title }?`
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'Confirm') {
        this.deleteVideo(video);
      }
    });
  }

  deleteVideo(video: VideoMetadata) {

  }

  async loadVideos() {
    try {
      this.loading = true;
      this.videoData.data = await this.videoService.getVideos();
    } catch (err) {
      console.log(err);
    } finally {
      this.loading = false;
    }
  }

  navigate(page: string) {
    switch (page) {
      case 'assistants':
        this.router.navigate(['admin/assistants']);
        break;
      case 'admins':
        this.router.navigate(['admin/admins']);
        break;
      case 'owners':
        this.router.navigate(['admin/owners']);
        break;
      case 'videos':
        this.router.navigate(['admin/videos']);
        break;
      default:
        break;
    }
  }
}
