import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective, NgForm, ValidatorFn, AbstractControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from '../../services/user.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { ErrorStateMatcher } from '@angular/material/core';

export class UidErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return ((control.dirty || control.touched || isSubmitted) && form.hasError('invalidUid'));
  }
}

@Component({
  selector: 'app-search-dialog',
  templateUrl: './search-dialog.component.html',
  styleUrls: ['./search-dialog.component.scss']
})
export class SearchDialogComponent implements OnInit {

  loading = false;
  searchUidForm: FormGroup;
  searchEmailForm: FormGroup;
  searchTypes = ['Email', 'Uid'];
  searchType = 'Email';
  matcher = new UidErrorStateMatcher();
  email = new FormControl('', [Validators.required, Validators.email]);

  constructor(
  public dialogRef: MatDialogRef<SearchDialogComponent>,
  private snackbarService: SnackbarService,
  private userService: UserService,
  @Inject(MAT_DIALOG_DATA) public data) {
  }

  ngOnInit(): void {
    this.searchEmailForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
    });
    this.searchUidForm = new FormGroup({
      uid: new FormControl('', [Validators.required])
    }, {
      validators: [
        this.validateUid('uid'),
      ]
    });
  }

  validateUid(uidKey: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (!control) { return null; }
      const uid = control.get(uidKey).value;
      const expression =  /^[a-zA-Z0-9]{28}$/;
      if (!uid.match(expression)) {
        return { invalidUid: true };
      }
      return null;
    };
  }

  close() {
    this.dialogRef.close();
  }

  async onSubmit() {
    let uid = '';
    if (this.searchType === 'Email') {
      try {
        this.loading = true;
        uid = (await this.userService.getUidFromEmail(this.searchEmailForm.getRawValue().email)).uid;
      } catch (err) {
        console.log(err);
        this.loading = false;
        return;
      }
    } else {
      uid = this.searchUidForm.getRawValue().uid;
    }
    try {
      this.loading = true;
      const user = (await this.userService.getUser(uid)).data();
      console.log(user);
      this.dialogRef.close({ user });
    } catch (err) {
      console.log(err);
    } finally {
      this.loading = false;
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  click(result) {
    this.dialogRef.close(result);
  }
}
