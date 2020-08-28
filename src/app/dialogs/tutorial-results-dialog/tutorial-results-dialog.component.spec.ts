import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorialResultsDialogComponent } from './tutorial-results-dialog.component';

describe('TutorialResultsDialogComponent', () => {
  let component: TutorialResultsDialogComponent;
  let fixture: ComponentFixture<TutorialResultsDialogComponent>;

  beforeEach(async(() => {
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
