import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionBar } from './option-bar';

describe('OptionBar', () => {
  let component: OptionBar;
  let fixture: ComponentFixture<OptionBar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OptionBar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OptionBar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
