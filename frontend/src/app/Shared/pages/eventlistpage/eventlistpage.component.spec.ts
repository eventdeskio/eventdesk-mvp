import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventlistpageComponent } from './eventlistpage.component';

describe('EventlistpageComponent', () => {
  let component: EventlistpageComponent;
  let fixture: ComponentFixture<EventlistpageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventlistpageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventlistpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
