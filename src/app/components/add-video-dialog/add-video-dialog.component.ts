import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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
  addVideoForm: FormGroup;
  tutorial = false;
  quality = 'good';

  constructor(
  public dialogRef: MatDialogRef<AddVideoDialogComponent>,
  private snackbarService: SnackbarService,
  private videoService: VideoService,
  @Inject(MAT_DIALOG_DATA) public data) {
    this.permissionData = data;
    this.tutorial = data.tutorial;
  }

  ngOnInit(): void {
    if (!this.tutorial) {
      this.addVideoForm = new FormGroup({
        url: new FormControl('', [Validators.required]),
        fps: new FormControl('', [Validators.required])
      });
    } else {
      this.addVideoForm = new FormGroup({
        url: new FormControl('', [Validators.required]),
        fps: new FormControl('', [Validators.required]),
        floor: new FormControl(0, [Validators.required]),
        ceiling: new FormControl(0, [Validators.required]),
        quality: new FormControl(this.quality)
      });
    }
  }

  close() {
    this.dialogRef.close();
  }

  async onSubmit() {
    const data = this.addVideoForm.getRawValue();
    try {
      this.loading = true;
      if (this.tutorial) {
        if (this.quality === 'noBubbles') {
          data.noBubbles = true;
          data.washOut = false;
        } else if (this.quality === 'washOut') {
          data.noBubbles = false;
          data.washOut = true;
        }
        await this.videoService.addTutorialVideo(data);
      } else {
        await this.videoService.addVideo(data);
      }
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
