import { TestBed } from '@angular/core/testing';

import { SearchGithubService } from './search-github.service';

describe('SearchGithubService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SearchGithubService = TestBed.get(SearchGithubService);
    expect(service).toBeTruthy();
  });
});
