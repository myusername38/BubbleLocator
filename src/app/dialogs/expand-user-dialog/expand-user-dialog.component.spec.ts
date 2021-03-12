import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ExpandUserDialogComponent } from './expand-user-dialog.component';

describe('ExpandUserDialogComponent', () => {
  let component: ExpandUserDialogComponent;
  let fixture: ComponentFixture<ExpandUserDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpandUserDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpandUserDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
