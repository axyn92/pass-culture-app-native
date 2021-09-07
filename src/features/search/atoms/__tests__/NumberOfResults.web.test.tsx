import { plural } from '@lingui/macro'
import React from 'react'

import { render } from 'tests/utils/web'

import { NumberOfResults } from '../NumberOfResults'

jest.mock('react-query')

describe('NumberOfResults component', () => {
  it('should correctly format the number of hit', () => {
    const getResultText = (count: number) =>
      plural(count, {
        one: '# résultat',
        other: '# résultats',
      })
    expect(render(<NumberOfResults nbHits={0} />).container.textContent).toBe('')
    render(<NumberOfResults nbHits={1} />).getByText(getResultText(1))
    render(<NumberOfResults nbHits={2} />).getByText(getResultText(2))
    render(<NumberOfResults nbHits={1234} />).getByText(getResultText(1234))
  })
})
