import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-select-files-dialog',
  templateUrl: './select-files-dialog.component.html',
  styleUrls: ['./select-files-dialog.component.scss']
})
export class SelectFilesDialogComponent implements OnInit {

  videos = [];

  constructor(
    public dialogRef: MatDialogRef<SelectFilesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data) {}

  ngOnInit(): void {
  }

  handleFileInput(files: FileList) {
    Array.from(files).forEach(file => { this.videos.push({ url: URL.createObjectURL(file), name: file.name }) });
    this.dialogRef.close({ videos: this.videos });
  }

  close() {
    this.dialogRef.close();
  }
}

