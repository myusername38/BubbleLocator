import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VideosPieChartComponent } from './videos-pie-chart.component';

describe('VideosPieChartComponent', () => {
  let component: VideosPieChartComponent;
  let fixture: ComponentFixture<VideosPieChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideosPieChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideosPieChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
