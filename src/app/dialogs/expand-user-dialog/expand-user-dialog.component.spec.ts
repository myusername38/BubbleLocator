import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpandUserDialogComponent } from './expand-user-dialog.component';

describe('ExpandUserDialogComponent', () => {
  let component: ExpandUserDialogComponent;
  let fixture: ComponentFixture<ExpandUserDialogComponent>;

  beforeEach(async(() => {
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
