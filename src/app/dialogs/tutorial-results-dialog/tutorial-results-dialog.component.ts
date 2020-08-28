import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from '../../components/bubble-locator/bubble-locator.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tutorial-results-dialog',
  templateUrl: './tutorial-results-dialog.component.html',
  styleUrls: ['./tutorial-results-dialog.component.scss']
})

export class TutorialResultsDialogComponent implements OnInit {

  accepted = false;
  completed = false;
  count = 0;
  toPass = 0;

  constructor(
    public dialogRef: MatDialogRef<TutorialResultsDialogComponent>,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data) {
      this.accepted = data.accepted;
      this.count = data.count;
      this.toPass = data.toPass;
      this.completed = this.count >= this.toPass;
    }

  ngOnInit(): void {

  }

  rateAnotherVideo() {
    this.router.navigate(['bubbleLocator/tutorial']);
    this.close();
  }

  rateVideo() {
    this.router.navigate(['bubbleLocator/']);
    this.close();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  click(result) {
    this.dialogRef.close(result);
  }

  close() {
    this.dialogRef.close();
  }
}
