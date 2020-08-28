import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssistantMenuComponent } from './assistant-menu.component';

describe('AssistantMenuComponent', () => {
  let component: AssistantMenuComponent;
  let fixture: ComponentFixture<AssistantMenuComponent>;

  beforeEach(async(() => {
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
