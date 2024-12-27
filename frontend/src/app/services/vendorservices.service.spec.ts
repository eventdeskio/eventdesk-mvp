import { TestBed } from '@angular/core/testing';

import { VendorservicesService } from './vendorservices.service';



describe('VendorservicesService', () => {
  let service: VendorservicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VendorservicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
