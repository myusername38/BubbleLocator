import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserScoreDialogComponent } from '../../../../dialogs/user-score-dialog/user-score-dialog.component';

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

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {

  }

  moreInfo() {
    const dialogRef = this.dialog.open(UserScoreDialogComponent, {
      disableClose: true,
      width: '800px',
      data: { }
    });
    dialogRef.afterClosed().subscribe(result => {});
  }
}
