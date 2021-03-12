import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AnnouncementFormDialogComponent } from './announcement-form-dialog.component';

describe('AnnouncementFormDialogComponent', () => {
  let component: AnnouncementFormDialogComponent;
  let fixture: ComponentFixture<AnnouncementFormDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AnnouncementFormDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnouncementFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
