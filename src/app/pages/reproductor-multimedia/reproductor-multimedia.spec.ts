import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReproductorMultimedia } from './reproductor-multimedia';

describe('ReproductorMultimedia', () => {
  let component: ReproductorMultimedia;
  let fixture: ComponentFixture<ReproductorMultimedia>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReproductorMultimedia]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReproductorMultimedia);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
