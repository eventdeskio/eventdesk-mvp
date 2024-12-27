import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostnavbarComponent } from './hostnavbar.component';

describe('HostnavbarComponent', () => {
  let component: HostnavbarComponent;
  let fixture: ComponentFixture<HostnavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostnavbarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HostnavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
