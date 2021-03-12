import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TutorialResultsDialogComponent } from './tutorial-results-dialog.component';

describe('TutorialResultsDialogComponent', () => {
  let component: TutorialResultsDialogComponent;
  let fixture: ComponentFixture<TutorialResultsDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TutorialResultsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TutorialResultsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
