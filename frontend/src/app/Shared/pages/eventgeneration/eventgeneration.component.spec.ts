import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventgenerationComponent } from './eventgeneration.component';

describe('EventgenerationComponent', () => {
  let component: EventgenerationComponent;
  let fixture: ComponentFixture<EventgenerationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventgenerationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventgenerationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
