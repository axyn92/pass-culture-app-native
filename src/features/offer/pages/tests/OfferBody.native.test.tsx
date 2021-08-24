import mockdate from 'mockdate'
import React from 'react'

import { OfferBody } from 'features/offer/pages/OfferBody'
import { fireEvent, render } from 'tests/utils'

jest.mock('react-query')
jest.mock('../../api/useOffer')
jest.mock('features/home/api')
jest.mock('features/home/services/useAvailableCredit')

describe('<OfferBody />', () => {
  beforeAll(() => {
    mockdate.set(new Date(2021, 0, 1))
  })

  const onScroll = jest.fn()

  const offerId = 1

  beforeEach(jest.clearAllMocks)

  it("should open the report modal upon clicking on 'signaler l'offre'", async () => {
    const OfferBodyComponent = render(<OfferBody offerId={offerId} onScroll={onScroll} />)

    const reportOfferButton = await OfferBodyComponent.findByTestId('report-offer-body')

    fireEvent.press(reportOfferButton)
    expect(OfferBodyComponent).toMatchSnapshot()
  })
})
