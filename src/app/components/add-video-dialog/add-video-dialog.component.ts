import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { VideoService } from '../../services/video.service';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-add-video-dialog',
  templateUrl: './add-video-dialog.component.html',
  styleUrls: ['./add-video-dialog.component.scss']
})
export class AddVideoDialogComponent implements OnInit {

  permissionData = null;
  loading = false;
  addUserForm: FormGroup;

  constructor(
  public dialogRef: MatDialogRef<AddVideoDialogComponent>,
  private snackbarService: SnackbarService,
  private videoService: VideoService,
  @Inject(MAT_DIALOG_DATA) public data) {
    this.permissionData = data;
  }

  ngOnInit(): void {
    this.addUserForm = new FormGroup({
      url: new FormControl('', [Validators.required]),
    });
  }

  close() {
    this.dialogRef.close();
  }

  async onSubmit() {
    const url = this.addUserForm.getRawValue().url;
    try {
      this.loading = true;
      await this.videoService.addVideo(url);
      this.snackbarService.showInfo(`Video has been added`);
      this.dialogRef.close({ status: 'complete' });
    } catch (err) {
      console.log(err);
      this.snackbarService.showError('Error when adding video');
    } finally {
      this.loading = false;
    }
  }
}
