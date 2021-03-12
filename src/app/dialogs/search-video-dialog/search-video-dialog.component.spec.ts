import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SearchVideoDialogComponent } from './search-video-dialog.component';

describe('SearchVideoDialogComponent', () => {
  let component: SearchVideoDialogComponent;
  let fixture: ComponentFixture<SearchVideoDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchVideoDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchVideoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
