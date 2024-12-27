import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HosteventslistpageComponent } from './hosteventslistpage.component';

describe('HosteventslistpageComponent', () => {
  let component: HosteventslistpageComponent;
  let fixture: ComponentFixture<HosteventslistpageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HosteventslistpageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HosteventslistpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
