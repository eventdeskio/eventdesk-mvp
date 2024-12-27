import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorlistpageComponent } from './vendorlistpage.component';

describe('VendorlistpageComponent', () => {
  let component: VendorlistpageComponent;
  let fixture: ComponentFixture<VendorlistpageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VendorlistpageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorlistpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
