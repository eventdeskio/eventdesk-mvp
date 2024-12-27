import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendoreventslistComponent } from './vendoreventslist.component';

describe('VendoreventslistComponent', () => {
  let component: VendoreventslistComponent;
  let fixture: ComponentFixture<VendoreventslistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VendoreventslistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendoreventslistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
