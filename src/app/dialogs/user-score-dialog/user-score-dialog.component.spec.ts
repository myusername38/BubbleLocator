import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UserScoreDialogComponent } from './user-score-dialog.component';

describe('UserScoreDialogComponent', () => {
  let component: UserScoreDialogComponent;
  let fixture: ComponentFixture<UserScoreDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UserScoreDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserScoreDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
