import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from '../../services/user.service';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-add-permission-dialog',
  templateUrl: './add-permission-dialog.component.html',
  styleUrls: ['./add-permission-dialog.component.scss']
})
export class AddPermissionDialogComponent implements OnInit {

  permissionData = null;
  loading = false;
  addUserForm: FormGroup;

  constructor(
  public dialogRef: MatDialogRef<AddPermissionDialogComponent>,
  private snackbarService: SnackbarService,
  private userService: UserService,
  @Inject(MAT_DIALOG_DATA) public data) {
    this.permissionData = data;
  }

  ngOnInit(): void {
    this.addUserForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
    });
  }

  close() {
    this.dialogRef.close();
  }

  async onSubmit() {
    const email = this.addUserForm.getRawValue().email;
    try {
      this.loading = true;
      const uid = (await this.userService.getUidFromEmail(email)).uid;
      const apiCall = this.getApiCall(uid);
      await apiCall;
      this.snackbarService.showInfo(`${ email } is now an ${ this.permissionData.role }`);
      this.dialogRef.close({ status: 'complete' });
    } catch (err) {
      console.log(err);
      if (err.error.err.code && err.error.err.code === 'auth/user-not-found') {
        this.snackbarService.showError(`${ email } does not exist`);
      } else if (err.err.message === 'Not authorized to get Uid') {
        this.snackbarService.showError('Not authorized to get Uid');
      } else {
        console.log(err);
      }
    } finally {
      this.loading = false;
    }
  }

  getApiCall(email: string) {
    switch (this.permissionData.role) {
      case 'assistant':
        return this.userService.grantAssistant(email);
      case 'admin':
        return this.userService.grantAdmin(email);
      case 'owner':
        return this.userService.grantOwner(email);
      default:
        return null;
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  click(result) {
    this.dialogRef.close(result);
  }
}
