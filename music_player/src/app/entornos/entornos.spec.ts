import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Entornos } from './entornos';

describe('Entornos', () => {
  let component: Entornos;
  let fixture: ComponentFixture<Entornos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Entornos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Entornos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
