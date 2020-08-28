import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpandVideoDialogComponent } from './expand-video-dialog.component';

describe('ExpandVideoDialogComponent', () => {
  let component: ExpandVideoDialogComponent;
  let fixture: ComponentFixture<ExpandVideoDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpandVideoDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpandVideoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
