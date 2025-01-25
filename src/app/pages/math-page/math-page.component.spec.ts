import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MathPageComponent } from './math-page.component';

describe('MathPageComponent', () => {
  let component: MathPageComponent;
  let fixture: ComponentFixture<MathPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MathPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MathPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
