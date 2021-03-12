import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ReviewQualityDialogComponent } from './review-quality-dialog.component';

describe('ReviewQualityDialogComponent', () => {
  let component: ReviewQualityDialogComponent;
  let fixture: ComponentFixture<ReviewQualityDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ReviewQualityDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewQualityDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
