import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClipViewerControllerComponent } from './clip-viewer-controller.component';

describe('ClipViewerControllerComponent', () => {
  let component: ClipViewerControllerComponent;
  let fixture: ComponentFixture<ClipViewerControllerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClipViewerControllerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ClipViewerControllerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
