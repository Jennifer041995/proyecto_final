import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AudioControls } from './audio-controls';

describe('AudioControls', () => {
  let component: AudioControls;
  let fixture: ComponentFixture<AudioControls>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AudioControls]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AudioControls);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
