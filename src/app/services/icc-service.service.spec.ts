import { TestBed } from '@angular/core/testing';

import { IccServiceService } from './icc-service.service';

describe('IccServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IccServiceService = TestBed.get(IccServiceService);
    expect(service).toBeTruthy();
  });
});
