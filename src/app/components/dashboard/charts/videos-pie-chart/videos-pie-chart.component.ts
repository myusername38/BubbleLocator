import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-videos-pie-chart',
  templateUrl: './videos-pie-chart.component.html',
  styleUrls: ['./videos-pie-chart.component.scss']
})
export class VideosPieChartComponent implements OnInit {

  showXAxis = true;
  showYAxis = true;
  gradient = false;
  xAxisLabel = 'Number';
  showYAxisLabel = true;
  yAxisLabel = 'Reviews Per Day';
  timeline = true;
  chartData = [
    {
      name: 'Incomplete Videos',
      value: 0,
      color: '#00A7E1',
    },
    {
      name: 'Rated Videos',
      value: 1,
      color: '#D00000'
    },
  ];
  incomplete = 0;
  complete = 0;
  unusable = 0;
  showLegend: boolean = false;
  showLabels: boolean = false;
  isDoughnut: boolean = false;
  legendPosition: string = 'bottom';
  view = [200, 200];

  colorScheme = {
    domain: ['#00A7E1', '#D00000']
  };

  constructor(private db: AngularFirestore) { }

  ngOnInit(): void {
    this.db.doc('/metadata/complete-videos').ref.onSnapshot(doc => {
      this.complete += doc.data().length;
      this.updateChart();
    });
    this.db.doc('/metadata/incomplete-videos').ref.onSnapshot(doc => {
      this.incomplete = doc.data().length;
      this.updateChart();
    });
    this.db.doc('/metadata/unusable-videos').ref.onSnapshot(doc => {
      this.unusable = doc.data().length;
      this.updateChart();
    });
  }

  updateChart() {
    this.chartData.forEach(item => {
      if (item.name === 'Incomplete Videos') {
        item.value = this.incomplete;
      } else if (item.name === 'Rated Videos') {
        item.value = this.complete + this.unusable;
      }
    });
    this.chartData = [...this.chartData];
  }

  public dateTickFormatting(val: any): string {
    return new Date(val).toLocaleDateString();
  }

  getPercentage(num) {
    const divider = (this.incomplete + this.complete + this.unusable);
    if (divider !== 0) {
      return Math.round((num / divider) * 100);
    } else {
      return 0;
    }
  }
}

