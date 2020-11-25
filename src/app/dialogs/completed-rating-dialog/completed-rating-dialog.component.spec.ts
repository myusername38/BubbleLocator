import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompletedRatingDialogComponent } from './completed-rating-dialog.component';

describe('CompletedRatingDialogComponent', () => {
  let component: CompletedRatingDialogComponent;
  let fixture: ComponentFixture<CompletedRatingDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompletedRatingDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompletedRatingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
