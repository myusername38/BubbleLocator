import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddPermissionDialogComponent } from './add-permission-dialog.component';

describe('AddPermissionDialogComponent', () => {
  let component: AddPermissionDialogComponent;
  let fixture: ComponentFixture<AddPermissionDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPermissionDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPermissionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
