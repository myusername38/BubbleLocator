import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAnnouncementDialogComponent } from './view-announcement-dialog.component';

describe('ViewAnnouncementDialogComponent', () => {
  let component: ViewAnnouncementDialogComponent;
  let fixture: ComponentFixture<ViewAnnouncementDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewAnnouncementDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAnnouncementDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
