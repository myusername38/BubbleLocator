import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectFilesDialogComponent } from './select-files-dialog.component';

describe('SelectFilesDialogComponent', () => {
  let component: SelectFilesDialogComponent;
  let fixture: ComponentFixture<SelectFilesDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectFilesDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectFilesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
