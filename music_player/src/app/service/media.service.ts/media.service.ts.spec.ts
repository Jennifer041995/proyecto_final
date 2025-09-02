import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaServiceTs } from './media.service.ts';

describe('MediaServiceTs', () => {
  let component: MediaServiceTs;
  let fixture: ComponentFixture<MediaServiceTs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MediaServiceTs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MediaServiceTs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
