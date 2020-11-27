import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-user-score-dialog',
  templateUrl: './user-score-dialog.component.html',
  styleUrls: ['./user-score-dialog.component.scss']
})

export class UserScoreDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<UserScoreDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data,) { }

    onNoClick(): void {
      this.dialogRef.close();
    }

    close() {
      this.dialogRef.close();
    }

}
