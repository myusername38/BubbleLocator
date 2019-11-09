import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BubbleLocatorComponent } from './bubble-locator.component';

describe('BubbleLocatorComponent', () => {
  let component: BubbleLocatorComponent;
  let fixture: ComponentFixture<BubbleLocatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BubbleLocatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BubbleLocatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
