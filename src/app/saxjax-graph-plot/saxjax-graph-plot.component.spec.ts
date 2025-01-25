import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaxjaxGraphPlotComponent } from './saxjax-graph-plot.component';

describe('SaxjaxGraphPlotComponent', () => {
  let component: SaxjaxGraphPlotComponent;
  let fixture: ComponentFixture<SaxjaxGraphPlotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaxjaxGraphPlotComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SaxjaxGraphPlotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
