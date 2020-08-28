import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-delete-user-dialog',
  templateUrl: './delete-user-dialog.component.html',
  styleUrls: ['./delete-user-dialog.component.scss']
})
export class DeleteUserDialogComponent implements OnInit {

  permissionData = null;
  loading = false;

  constructor(
  public dialogRef: MatDialogRef<DeleteUserDialogComponent>,
  private snackbarService: SnackbarService,
  private userService: UserService,
  @Inject(MAT_DIALOG_DATA) public data) {
    this.permissionData = data;
  }

  ngOnInit(): void {

  }

  close() {

  }
}
