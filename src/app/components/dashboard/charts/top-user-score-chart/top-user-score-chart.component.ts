import { Component, OnInit, Input } from '@angular/core';
import { UserService } from '../../../../services/user.service';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-top-user-score-chart',
  templateUrl: './top-user-score-chart.component.html',
  styleUrls: ['./top-user-score-chart.component.scss']
})
export class TopUserScoreChartComponent implements OnInit {

  loading = false;
  colorScheme = {
    domain: ['#00A7E1', '#D00000']
  };

@Input()
    usersData = [
      {
        name: 'Top Rater',
        value: 1,
        color: this.colorScheme.domain[0]
      }
    ];

  constructor(private db: AngularFirestore) { }

  ngOnInit(): void {

  }

  async getUsersData() {
    await this.db
  }

}
