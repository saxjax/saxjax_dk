import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TlfFieldComponent } from './tlf-field.component';

describe('TlfFieldComponent', () => {
  let component: TlfFieldComponent;
  let fixture: ComponentFixture<TlfFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TlfFieldComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TlfFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
