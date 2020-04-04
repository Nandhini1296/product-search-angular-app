import { TestBed } from '@angular/core/testing';

import { ProductSearchServiceService } from './product-search-service.service';

describe('ProductSearchServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProductSearchServiceService = TestBed.get(ProductSearchServiceService);
    expect(service).toBeTruthy();
  });
});
