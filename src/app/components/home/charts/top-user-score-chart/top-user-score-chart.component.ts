import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../../services/user.service';

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
  usersData = [
    {
      name: 'Top Rater',
      value: 1,
      color: this.colorScheme.domain[0]
    }
  ];

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.getUsersData();
  }

  async getUsersData() {
    try {
      this.loading = true;
      const data = await this.userService.getUserScoreGraphData();
      this.usersData = [
        {
          name: 'Top Rater',
          value: data.top,
          color: this.colorScheme.domain[0]
        },
      ];
      if (data.user !== 0) {
        this.usersData.push({
          name: 'Your Score',
          value: data.user,
          color: this.colorScheme.domain[1]
        });
      }
      this.usersData = [...this.usersData];
    } catch (err) {
      console.log(err);
    } finally {
      this.loading = false;
    }
  }

}
