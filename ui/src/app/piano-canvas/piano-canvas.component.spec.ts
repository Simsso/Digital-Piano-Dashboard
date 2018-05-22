import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PianoCanvasComponent } from './piano-canvas.component';

describe('PianoCanvasComponent', () => {
  let component: PianoCanvasComponent;
  let fixture: ComponentFixture<PianoCanvasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PianoCanvasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PianoCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
