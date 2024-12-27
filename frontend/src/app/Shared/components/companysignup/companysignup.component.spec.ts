import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanysignupComponent } from './companysignup.component';

describe('CompanysignupComponent', () => {
  let component: CompanysignupComponent;
  let fixture: ComponentFixture<CompanysignupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanysignupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanysignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
