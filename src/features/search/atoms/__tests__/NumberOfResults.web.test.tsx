import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { LocationType } from 'features/search/enums'
import { LocationFilter } from 'features/search/types'
import { GeoCoordinates } from 'libs/geolocation'
import { mockedSuggestedVenues } from 'libs/venue/fixtures/mockedSuggestedVenues'
import { fireEvent, render } from 'tests/utils/web'

import { NumberOfResults } from '../NumberOfResults'

jest.mock('react-query')

let mockPosition: GeoCoordinates | null = null
jest.mock('libs/geolocation', () => ({
  useGeolocation: jest.fn(() => ({ position: mockPosition })),
}))

let mockLocationFilter: LocationFilter = {
  locationType: LocationType.VENUE,
  venue: mockedSuggestedVenues[0],
}
jest.mock('features/search/pages/SearchWrapper', () => ({
  useSearch: () => ({ searchState: { locationFilter: mockLocationFilter } }),
}))

describe('NumberOfResults component', () => {
  it('should correctly format the number of hit - without venue', () => {
    mockLocationFilter = { locationType: LocationType.EVERYWHERE }
    expect(render(<NumberOfResults nbHits={0} />).container.textContent).toBe('')
    render(<NumberOfResults nbHits={1} />).getByText('1 résultat')
    render(<NumberOfResults nbHits={2} />).getByText('2 résultats')
    render(<NumberOfResults nbHits={1234} />).getByText('1 234 résultats')
  })

  describe('with venue', () => {
    beforeEach(() => {
      mockLocationFilter = { locationType: LocationType.VENUE, venue: mockedSuggestedVenues[0] }
    })

    it('should correctly format the number of hit', () => {
      expect(render(<NumberOfResults nbHits={0} />).container.textContent).toBe('')
      render(<NumberOfResults nbHits={1} />).getByText('1 résultat pour')
      render(<NumberOfResults nbHits={2} />).getByText('2 résultats pour')
      render(<NumberOfResults nbHits={1234} />).getByText('1 234 résultats pour')
    })

    it('should returns to locationFilter - Everywhere if geolocation not activated', () => {
      mockPosition = null
      const { getByTestId } = render(<NumberOfResults nbHits={2} />)

      fireEvent.click(getByTestId('Enlever le lieu'))

      expect(navigate).toBeCalledWith('TabNavigator', {
        screen: 'Search',
        params: { locationFilter: { locationType: LocationType.EVERYWHERE } },
      })
    })

    it('should returns to locationFilter - Everywhere if geolocation not activated', () => {
      mockPosition = { latitude: 20, longitude: 23 }
      const { getByTestId } = render(<NumberOfResults nbHits={2} />)

      fireEvent.click(getByTestId('Enlever le lieu'))

      expect(navigate).toBeCalledWith('TabNavigator', {
        screen: 'Search',
        params: { locationFilter: { locationType: LocationType.AROUND_ME, aroundRadius: 100 } },
      })
    })
  })
})
