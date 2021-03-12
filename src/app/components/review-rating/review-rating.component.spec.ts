import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ReviewRatingComponent } from './review-rating.component';

describe('ReviewRatingComponent', () => {
  let component: ReviewRatingComponent;
  let fixture: ComponentFixture<ReviewRatingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ReviewRatingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewRatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
