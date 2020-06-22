import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogConfirmationComponent } from './../dialogs/dialog-confirmation/dialog-confirmation.component';

@Component({
  selector: 'app-locator',
  templateUrl: './locator.component.html',
  styleUrls: ['./locator.component.scss']
})
export class LocatorComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  exitLocator() {
    const dialogRef = this.dialog.open(DialogConfirmationComponent, {
      width: '500px',
      data: {
        options: [
          'Confirm', 'Cancel'
        ],
        message: 'Confirm abandoning rating',
        description: 'Your work will not be saved'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
     console.log(result);
    });
  }
}
