import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { AddPermissionDialogComponent } from '../add-permission-dialog/add-permission-dialog.component';
import { DialogConfirmationComponent } from '../dialog-confirmation/dialog-confirmation.component';
import { UserService } from '../../services/user.service';
import { RoleData } from '../../interfaces/role-data';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-admin-menu',
  templateUrl: './admin-menu.component.html',
  styleUrls: ['./admin-menu.component.scss']
})
export class AdminMenuComponent implements OnInit {

  userData = new MatTableDataSource<RoleData>();
  loading = false;
  displayedColumns: string[] = ['email', 'role', 'uid', 'date', 'expand'];

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor( private snackbarService: SnackbarService,
               private userService: UserService,
               private db: AngularFirestore,
               private authService: AuthService,
               private router: Router,
               public dialog: MatDialog ) { }

  ngOnInit(): void {
    this.userData.paginator = this.paginator;
    this.loading = true;
    this.db.collection('user-roles/roles/admins').ref.onSnapshot((data) => {
      const docs: RoleData[] = [];
      data.forEach(doc => {
        docs.push(doc.data() as RoleData);
      });
      this.userData.data = docs;
      this.loading = false;
    });
  }

  addAdmin() {
    const dialogRef = this.dialog.open(AddPermissionDialogComponent, {
      disableClose: true,
      width: '500px',
      data: {
        role: 'admin',
        status: 'incomplete'
      },
    });
  }

  expandUser() {

  }
  async makeAssistant(user: RoleData) {
    try {
      this.loading = true;
      await this.userService.grantAssistant(user.uid);
      this.snackbarService.showInfo(`${ user.email } is now an Assistant`);
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
