import { useNetInfo } from '@react-native-community/netinfo'
import { useEffect } from 'react'

import { api } from 'api/api'
import { getEntries } from 'features/home/api'
import { QueryKeys } from 'libs/queryKeys'
import { queryClient } from 'libs/react-query/queryClient'

const prefetchQueries = async () => {
  try {
    await queryClient.prefetchQuery(QueryKeys.HOMEPAGE_MODULES, getEntries)
    await queryClient.prefetchQuery(QueryKeys.SETTINGS, () => api.getnativev1settings())
  } catch (err) {
    // do nothing in case the pretching of queries fails
  }
}

export const usePrefetchQueries = () => {
  const networkInfo = useNetInfo()

  useEffect(() => {
    if (!networkInfo.isConnected) return
    prefetchQueries()
  }, [])
}
