import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopUserScoreChartComponent } from './top-user-score-chart.component';

describe('TopUserScoreChartComponent', () => {
  let component: TopUserScoreChartComponent;
  let fixture: ComponentFixture<TopUserScoreChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopUserScoreChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopUserScoreChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
