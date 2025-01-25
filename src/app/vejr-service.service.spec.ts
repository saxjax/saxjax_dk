import { TestBed } from '@angular/core/testing'

import { VejrServiceService } from './vejr-service.service'

describe('VejrServiceService', () => {
  let service: VejrServiceService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(VejrServiceService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
