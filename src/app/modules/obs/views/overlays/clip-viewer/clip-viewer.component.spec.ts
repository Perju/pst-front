import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClipViewerComponent } from './clip-viewer.component';

describe('ClipViewerComponent', () => {
  let component: ClipViewerComponent;
  let fixture: ComponentFixture<ClipViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClipViewerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClipViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
