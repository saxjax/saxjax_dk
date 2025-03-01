import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TunerWindowComponent } from './tuner-window.component';

describe('TunerWindowComponent', () => {
  let component: TunerWindowComponent;
  let fixture: ComponentFixture<TunerWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TunerWindowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TunerWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
