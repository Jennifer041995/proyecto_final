import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsoReproductor } from './uso-reproductor';

describe('UsoReproductor', () => {
  let component: UsoReproductor;
  let fixture: ComponentFixture<UsoReproductor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsoReproductor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsoReproductor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
