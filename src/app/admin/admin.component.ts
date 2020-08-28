import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  showFiller = false;
  role = '';
  @ViewChild('drawer', { static: false }) drawer: MatSidenav;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.authService.userRole.subscribe(role => {
      this.role = role;
    });
  }

  home() {
    this.router.navigate(['/home']);
  }

  adminPermission() {
    return this.role === 'owner' || this.role === 'admin';
  }

  owerPermission() {
    return this.role === 'owner';
  }

  navigate(page: string) {
    this.drawer.toggle();
    switch (page) {
      case 'home':
        this.router.navigate(['home']);
        break;
      case 'assistants':
        this.router.navigate(['admin/assistants']);
        break;
      case 'announcements':
        this.router.navigate(['admin/announcements']);
        break;
      case 'users':
        this.router.navigate(['admin/users']);
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
