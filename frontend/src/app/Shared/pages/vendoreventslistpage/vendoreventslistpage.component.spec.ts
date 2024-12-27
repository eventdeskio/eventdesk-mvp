import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendoreventslistpageComponent } from './vendoreventslistpage.component';

describe('VendoreventslistpageComponent', () => {
  let component: VendoreventslistpageComponent;
  let fixture: ComponentFixture<VendoreventslistpageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VendoreventslistpageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendoreventslistpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
