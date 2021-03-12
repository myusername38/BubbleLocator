import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalLocatorComponent } from './local-locator.component';

describe('LocalLocatorComponent', () => {
  let component: LocalLocatorComponent;
  let fixture: ComponentFixture<LocalLocatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LocalLocatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalLocatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
