import { ComponentFixture, TestBed } from '@angular/core/testing'

import { NoviaPageComponent } from './novia-page.component'

describe('NoviaPageComponent', () => {
  let component: NoviaPageComponent
  let fixture: ComponentFixture<NoviaPageComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoviaPageComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(NoviaPageComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
