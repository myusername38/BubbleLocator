import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AdminSideMenuComponent } from './admin-side-menu.component';

describe('AdminSideMenuComponent', () => {
  let component: AdminSideMenuComponent;
  let fixture: ComponentFixture<AdminSideMenuComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminSideMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminSideMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
