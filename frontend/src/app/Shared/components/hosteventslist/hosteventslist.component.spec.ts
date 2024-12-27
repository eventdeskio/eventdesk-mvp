import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HosteventslistComponent } from './hosteventslist.component';

describe('HosteventslistComponent', () => {
  let component: HosteventslistComponent;
  let fixture: ComponentFixture<HosteventslistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HosteventslistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HosteventslistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
