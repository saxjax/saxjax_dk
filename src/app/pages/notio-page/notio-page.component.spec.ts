import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotioPageComponent } from './notio-page.component';

describe('NotioPageComponent', () => {
  let component: NotioPageComponent;
  let fixture: ComponentFixture<NotioPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotioPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotioPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
