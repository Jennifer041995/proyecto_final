import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsoCanciones } from './uso-canciones';

describe('UsoCanciones', () => {
  let component: UsoCanciones;
  let fixture: ComponentFixture<UsoCanciones>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsoCanciones]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsoCanciones);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
