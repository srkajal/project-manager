import { TestBed } from '@angular/core/testing';

import { ApiTaskService } from './api.task-service';

describe('ApiTaskService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ApiTaskService = TestBed.get(ApiTaskService);
    expect(service).toBeTruthy();
  });
});
