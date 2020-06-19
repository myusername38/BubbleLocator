import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from '../../components/bubble-locator/bubble-locator.component';
import { Router} from '@angular/router';

@Component({
  selector: 'app-resolution-dialog',
  templateUrl: './resolution-dialog.component.html',
  styleUrls: ['./resolution-dialog.component.scss']
})
export class ResolutionDialogComponent {

  conformationData = null;
  constructor(
    public dialogRef: MatDialogRef<ResolutionDialogComponent>,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
      this.conformationData = data;
    }

  onNoClick(): void {
    this.dialogRef.close();
  }

  goHome() {
    this.router.navigate(['/home']);
    this.dialogRef.close();
  }
}
