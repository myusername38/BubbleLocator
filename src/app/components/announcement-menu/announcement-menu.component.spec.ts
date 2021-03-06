import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnouncementMenuComponent } from './announcement-menu.component';

describe('AnnouncementMenuComponent', () => {
  let component: AnnouncementMenuComponent;
  let fixture: ComponentFixture<AnnouncementMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnnouncementMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnouncementMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
