import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatDialog } from '@angular/material';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { AddPermissionDialogComponent } from '../add-permission-dialog/add-permission-dialog.component';
import { DialogConfirmationComponent } from '../dialog-confirmation/dialog-confirmation.component';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { RoleData } from '../../interfaces/role-data';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-owner-menu',
  templateUrl: './owner-menu.component.html',
  styleUrls: ['./owner-menu.component.scss']
})
export class OwnerMenuComponent implements OnInit {

  userData = new MatTableDataSource<RoleData>();
  loading = false;
  displayedColumns: string[] = ['email', 'role', 'uid', 'date', 'expand'];
  owner = false;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(private snackbarService: SnackbarService,
              private userService: UserService,
              private authService: AuthService,
              private router: Router,
              public dialog: MatDialog) { }

  ngOnInit(): void {
    this.userData.paginator = this.paginator;
    this.loadOwners();
  }

  addOwner() {
    const dialogRef = this.dialog.open(AddPermissionDialogComponent, {
      disableClose: true,
      width: '500px',
      data: {
        role: 'owner',
        status: 'incomplete'
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.status && result.status === 'complete') {
        setTimeout(() => this.loadOwners(), 200);
      }
    });
  }

  expandUser() {

  }

  makeAssistant() {

  }

  async loadOwners() {
    try {
      this.loading = true;
      this.userData.data = await this.userService.getOwners();
    } catch (err) {
      console.log(err);
    } finally {
      this.loading = false;
    }
  }

  async makeAdmin(user: RoleData) {
    try {
      this.loading = true;
      await this.userService.grantAdmin(user.uid);
      this.snackbarService.showInfo(`${ user.email } is now an Assistant`);
      setTimeout(() => this.loadOwners(), 200);
    } catch (err) {
      console.log(err);
    } finally {
      this.loading = false;
    }
  }

  async makeOwner(user: RoleData) {
    try {
      this.loading = true;
      await this.userService.grantAssistant(user.uid);
      this.snackbarService.showInfo(`${ user.email } is now an Owner`);
      setTimeout(() => this.loadOwners(), 200);
    } catch (err) {
      console.log(err);
    } finally {
      this.loading = false;
    }
  }

  async removeUserPermissions(user: RoleData) {
    try {
      this.loading = true;
      await this.userService.removePermissions(user.uid);
      this.snackbarService.showInfo(`${ user.email } is no longer an admin`);
      setTimeout(() => this.loadOwners(), 200);
    } catch (err) {
      console.log(err);
    } finally {
      this.loading = false;
    }
  }

  async deleteUser(user: RoleData) {
    try {
      this.loading = true;
      await this.authService.deleteUser(user.uid);
      this.snackbarService.showInfo(`${ user.email } has been removed`);
      setTimeout(() => this.loadOwners(), 200);
    } catch (err) {
      console.log(err);
    } finally {
      this.loading = false;
    }
  }

  async deleteUserButton(user: RoleData) {
    const dialogRef = this.dialog.open(DialogConfirmationComponent, {
      width: '500px',
      data: {
        options: [
          'Confirm', 'Cancel'
        ],
        message: `Delete user ${ user.email }?`
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'Confirm') {
        this.deleteUser(user);
      }
    });
  }

  navigate(page: string) {
    switch (page) {
      case 'assistants':
        this.router.navigate(['admin/assistants']);
        break;
      case 'admins':
        this.router.navigate(['admin/admins']);
        break;
      case 'owners':
        this.router.navigate(['admin/owners']);
        break;
      case 'videos':
        this.router.navigate(['admin/videos']);
        break;
      default:
        break;
    }
  }
}
