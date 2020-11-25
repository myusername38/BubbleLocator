import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Contributor } from './../../interfaces/contributor';
import { collaborators, decoBubblesTeam } from './contributors';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  raters = 3;
  ratings = 3;
  loading = false;
  showJoinMessage = false;
  decoBubblesTeam: Contributor[] = decoBubblesTeam;
  collaboratorTeam: Contributor[] = collaborators;

  constructor(private router: Router, private db: AngularFirestore) {}

  ngOnInit() {
    window.scroll(0, 0);
    this.backToTop();
    this.getData();
    setTimeout(() => {
      this.showJoinMessage = true;
    }, 750);
  }

  async getData() {
    try {
      this.loading = true;
      Promise.all([
        this.raters = (await this.db.doc('/metadata/users').ref.get()).data().length,
        this.ratings = (await this.db.doc('/metadata/all-time-ratings').ref.get()).data().length
      ]);
    } catch (err) {
      console.log(err);
    } finally {
      this.loading = false;
    }
  }

  login() {
    this.router.navigate(['/login']);
  }

  register() {
    this.router.navigate(['register']);
  }

  home() {
    this.router.navigate(['']);
  }

  privacy() {
    this.router.navigate(['privacy-policy']);
  }

  learnMore() {
    window.scroll(0, (window.innerHeight - 85));
  }

  backToTop() {
    window.scroll(0, 0);
  }
}
