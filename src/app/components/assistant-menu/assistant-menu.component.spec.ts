import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AssistantMenuComponent } from './assistant-menu.component';

describe('AssistantMenuComponent', () => {
  let component: AssistantMenuComponent;
  let fixture: ComponentFixture<AssistantMenuComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AssistantMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssistantMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
