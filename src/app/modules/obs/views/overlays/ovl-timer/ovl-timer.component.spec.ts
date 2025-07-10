import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OvlTimerComponent } from './ovl-timer.component';

describe('OvlTimerComponent', () => {
  let component: OvlTimerComponent;
  let fixture: ComponentFixture<OvlTimerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OvlTimerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OvlTimerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
