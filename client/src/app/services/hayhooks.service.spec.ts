import { TestBed } from '@angular/core/testing';

import { HayhooksService } from './hayhooks.service';

describe('HayhooksService', () => {
  let service: HayhooksService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HayhooksService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
