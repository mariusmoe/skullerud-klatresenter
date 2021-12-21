import { TestBed } from '@angular/core/testing';

import { SkullerudService } from './skullerud.service';

describe('SkullerudService', () => {
  let service: SkullerudService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SkullerudService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
