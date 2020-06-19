import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from '../../services/user.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { VideoService } from 'src/app/services/video.service';

@Component({
  selector: 'app-search-video-dialog',
  templateUrl: './search-video-dialog.component.html',
  styleUrls: ['./search-video-dialog.component.scss']
})
export class SearchVideoDialogComponent implements OnInit {

  loading = false;
  searchVideoForm: FormGroup;

  constructor(
  public dialogRef: MatDialogRef<SearchVideoDialogComponent>,
  private snackbarService: SnackbarService,
  private videoService: VideoService,
  @Inject(MAT_DIALOG_DATA) public data) { }

  ngOnInit(): void {
    this.searchVideoForm = new FormGroup({
      title: new FormControl('', [Validators.required]),
    });
  }

  close() {
    this.dialogRef.close();
  }

  async onSubmit() {
    try {
      this.loading = true;
      const title = this.searchVideoForm.getRawValue().title.replace(/ /g, '');
      const video = await this.videoService.searchVideo({ title });
      this.dialogRef.close({ video: video.video });
    } catch (err) {
      if (err.error && err.error.err && err.error.err === 'Video does not exist') {
        this.snackbarService.showError(err.error.err);
      } else {
        console.log(err);
      }
    } finally {
      this.loading = false;
    }

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  click(result) {
    this.dialogRef.close(result);
  }
}
