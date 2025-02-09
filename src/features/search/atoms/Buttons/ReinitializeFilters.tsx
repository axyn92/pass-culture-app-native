import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { useStagedSearch } from 'features/search/pages/SearchWrapper'
import { useMaxPrice } from 'features/search/utils/useMaxPrice'
import { accessibilityAndTestId } from 'libs/accessibilityAndTestId'
import { analytics } from 'libs/analytics'
import useFunctionOnce from 'libs/hooks/useFunctionOnce'
import { Typo } from 'ui/theme'

export const ReinitializeFilters = () => {
  const { dispatch } = useStagedSearch()
  const logReinitializeFilters = useFunctionOnce(() => {
    analytics.logReinitializeFilters()
  })
  const maxPrice = useMaxPrice()
  const reinitializeFilters = () => {
    dispatch({ type: 'INIT' })
    dispatch({
      type: 'SET_STATE',
      payload: {
        priceRange: [0, maxPrice],
      },
    })
    logReinitializeFilters()
  }

  return (
    <TouchableOpacity
      onPress={reinitializeFilters}
      {...accessibilityAndTestId(t`Réinitialiser les filtres`)}>
      <ButtonText>{t`Réinitialiser`}</ButtonText>
    </TouchableOpacity>
  )
}

const ButtonText = styled(Typo.ButtonText)(({ theme }) => ({
  color: theme.colors.white,
}))

const TouchableOpacity = styled.TouchableOpacity.attrs(({ theme }) => ({
  activeOpacity: theme.activeOpacity,
}))``
