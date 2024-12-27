import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostlistpageComponent } from './hostlistpage.component';

describe('HostlistpageComponent', () => {
  let component: HostlistpageComponent;
  let fixture: ComponentFixture<HostlistpageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostlistpageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HostlistpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
