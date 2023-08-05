import { TestBed } from '@angular/core/testing';

import { GlobalApiService } from './global-api.service';

describe('GlobalApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GlobalApiService = TestBed.get(GlobalApiService);
    expect(service).toBeTruthy();
  });
});
