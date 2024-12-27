import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanylistComponent } from './companylist.component';

describe('CompanylistComponent', () => {
  let component: CompanylistComponent;
  let fixture: ComponentFixture<CompanylistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanylistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanylistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
