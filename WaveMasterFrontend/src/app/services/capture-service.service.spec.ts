import { TestBed } from '@angular/core/testing';

import { CaptureServiceService } from './capture-service.service';

describe('CaptureServiceService', () => {
  let service: CaptureServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CaptureServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
