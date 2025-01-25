import { ComponentFixture, TestBed } from '@angular/core/testing'

import { MailFieldComponent } from './mail-field.component'

describe('MailFieldComponent', () => {
  let component: MailFieldComponent
  let fixture: ComponentFixture<MailFieldComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MailFieldComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(MailFieldComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
