import { useNetInfo } from '@react-native-community/netinfo'
import { useQuery } from 'react-query'

import { api } from 'api/api'
import { QueryKeys } from 'libs/queryKeys'

export const useExcluOffer = (id: number) => {
  const networkInfo = useNetInfo()

  return useQuery(
    [QueryKeys.OFFER, id],
    async () => {
      try {
        return await api.getnativev1offerofferId(id)
      } catch (error) {
        // do nothing as an offer in contentful may not be in the backend
        return undefined
      }
    },
    { enabled: typeof id === 'number' && networkInfo.isConnected }
  )
}
