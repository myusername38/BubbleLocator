import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {
  constructor(
    private snackBar: MatSnackBar
  ) {}

  showError(description: string, action: string = 'Close'): MatSnackBarRef<SimpleSnackBar> {
    return this.snackBar.open(description, action, { panelClass: 'snackbar-error',  duration: 5000 });
  }

  showInfo(description: string, noDuration = false): void {
    this.snackBar.open(description, null, noDuration ? {} : { duration: 2000 });
  }

  // `cb` will be invoked whenever the action button is clicked
  // if the button isn't clicked, it will never be called
  showInfoWithAction(description: string, cb: () => void, action = 'GO'): void {
    this.snackBar
      .open(description, action, { duration: 3500 })
      .onAction().subscribe(cb);
  }

  dismissSnackBar(): void {
    this.snackBar.dismiss();
  }
}
