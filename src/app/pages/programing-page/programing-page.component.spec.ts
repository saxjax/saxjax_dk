import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramingPageComponent } from './programing-page.component';

describe('ProgramingPageComponent', () => {
  let component: ProgramingPageComponent;
  let fixture: ComponentFixture<ProgramingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgramingPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProgramingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
