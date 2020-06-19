import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewsPerDayComponent } from './reviews-per-day.component';

describe('ReviewsPerDayComponent', () => {
  let component: ReviewsPerDayComponent;
  let fixture: ComponentFixture<ReviewsPerDayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReviewsPerDayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewsPerDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
