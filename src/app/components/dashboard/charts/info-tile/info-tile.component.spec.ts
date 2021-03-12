import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InfoTileComponent } from './info-tile.component';

describe('InfoTileComponent', () => {
  let component: InfoTileComponent;
  let fixture: ComponentFixture<InfoTileComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoTileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
