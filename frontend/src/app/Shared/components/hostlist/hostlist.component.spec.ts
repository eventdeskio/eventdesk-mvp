import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostlistComponent } from './hostlist.component';

describe('HostlistComponent', () => {
  let component: HostlistComponent;
  let fixture: ComponentFixture<HostlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostlistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HostlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
