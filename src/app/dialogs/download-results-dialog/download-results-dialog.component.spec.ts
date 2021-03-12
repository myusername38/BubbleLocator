import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadResultsDialogComponent } from './download-results-dialog.component';

describe('DownloadResultsDialogComponent', () => {
  let component: DownloadResultsDialogComponent;
  let fixture: ComponentFixture<DownloadResultsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DownloadResultsDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadResultsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
