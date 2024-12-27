import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventrequirementComponent } from './eventrequirement.component';

describe('EventrequirementComponent', () => {
  let component: EventrequirementComponent;
  let fixture: ComponentFixture<EventrequirementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventrequirementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventrequirementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
