import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-completed-rating-dialog',
  templateUrl: './completed-rating-dialog.component.html',
  styleUrls: ['./completed-rating-dialog.component.scss']
})
export class CompletedRatingDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<CompletedRatingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data) { }

    onNoClick(): void {
      this.dialogRef.close();
    }

    click(result) {
      this.dialogRef.close(result);
    }

}
