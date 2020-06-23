import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogConfirmationComponent } from './../dialogs/dialog-confirmation/dialog-confirmation.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-locator',
  templateUrl: './locator.component.html',
  styleUrls: ['./locator.component.scss']
})
export class LocatorComponent implements OnInit {

  constructor(public dialog: MatDialog, public router: Router) { }

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
     if (result === 'Confirm') {
       this.router.navigate(['home']);
     }
    });
  }
}
