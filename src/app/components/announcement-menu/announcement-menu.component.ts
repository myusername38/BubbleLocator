import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-announcement-menu',
  templateUrl: './announcement-menu.component.html',
  styleUrls: ['./announcement-menu.component.scss']
})
export class AnnouncementMenuComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {

  }

  navigate(page: string) {
    switch (page) {
      case 'assistants':
        this.router.navigate(['admin/assistants']);
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
