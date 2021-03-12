import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ResolutionDialogComponent } from './resolution-dialog.component';

describe('ResolutionDialogComponent', () => {
  let component: ResolutionDialogComponent;
  let fixture: ComponentFixture<ResolutionDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ResolutionDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResolutionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
