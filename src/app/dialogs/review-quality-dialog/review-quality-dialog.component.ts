import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-review-quality-dialog',
  templateUrl: './review-quality-dialog.component.html',
  styleUrls: ['./review-quality-dialog.component.scss']
})
export class ReviewQualityDialogComponent implements OnInit {

  options = ['Good Quality', 'Bad Quality', 'No Bubbles'];
  selected = this.options[0];
  loading = false;

  constructor(
    public dialogRef: MatDialogRef<ReviewQualityDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data) {}

  ngOnInit(): void {
  }

  submit() { // quick fix
    if (this.selected === 'Good Quality') {
      this.dialogRef.close('Good');
    } else {
      this.dialogRef.close(this.selected);
    }
  }

  goBack() {
    this.dialogRef.close('Back');
  }
}

