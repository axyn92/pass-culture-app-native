import { useNetInfo } from '@react-native-community/netinfo'
import { useQuery } from 'react-query'

import { SuggestedCity } from 'libs/place'
import { fetchCities } from 'libs/place/fetchCities'
import { QueryKeys } from 'libs/queryKeys'

export type CitiesResponse = Array<{
  nom: string
  code: string
  codeDepartement: string
  codeRegion: string
  codesPostaux: string[]
  population: number
}>

export const CITIES_API_URL = 'https://geo.api.gouv.fr/communes'

export const useCities = (postalCode: string) => {
  const networkInfo = useNetInfo()

  return useQuery([QueryKeys.CITIES, postalCode], () => fetchCities(postalCode), {
    enabled: postalCode.length >= 5 && networkInfo.isConnected,
    select: (data: CitiesResponse) =>
      data.map(({ nom, code }) => ({
        name: nom,
        code,
        postalCode,
      })) as SuggestedCity[],
  })
}
