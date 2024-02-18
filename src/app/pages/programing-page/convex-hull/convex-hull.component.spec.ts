import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConvexHullComponent } from './convex-hull.component';

describe('ConvexHullComponent', () => {
  let component: ConvexHullComponent;
  let fixture: ComponentFixture<ConvexHullComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConvexHullComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConvexHullComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
