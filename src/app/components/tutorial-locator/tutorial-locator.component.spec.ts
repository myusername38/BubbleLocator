import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TutorialLocatorComponent } from './tutorial-locator.component';

describe('TutorialLocatorComponent', () => {
  let component: TutorialLocatorComponent;
  let fixture: ComponentFixture<TutorialLocatorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TutorialLocatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TutorialLocatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
