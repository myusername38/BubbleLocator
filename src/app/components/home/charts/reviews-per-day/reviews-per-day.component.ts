import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-reviews-per-day',
  templateUrl: './reviews-per-day.component.html',
  styleUrls: ['./reviews-per-day.component.scss']
})
export class ReviewsPerDayComponent implements OnInit {

  showXAxis = true;
  showYAxis = true;
  gradient = false;
  xAxisLabel = 'Number';
  showYAxisLabel = true;
  yAxisLabel = 'Reviews Per Day';
  timeline = true;
  results = [
    {
      name: 'Video Reviews',
      series: []
    },
  ];
  colorScheme = {
    domain: ['#D00000', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  constructor(private db: AngularFirestore) { }

  ngOnInit(): void {
    this.db.collection('ratingsPerDay').ref.limit(10).orderBy('date', 'asc').onSnapshot((data) => {
      const series = [];
      data.forEach(doc => {
        const d = doc.data();
        series.push({ value: d.ratings, name: new Date(d.date).toISOString() });
      });
      this.results[0].series = series;
      this.results = [...this.results];
    });
  }

  public dateTickFormatting(val: any): string {
    return new Date(val).toLocaleDateString();
  }
}
