import { AlgoliaHit } from 'libs/algolia'
import { Geoloc } from 'libs/algolia/algolia.d'
import {
  attributesToRetrieve,
  fetchAlgolia,
  fetchAlgoliaHits,
  fetchMultipleAlgolia,
  filterSearchHit,
  transformAlgoliaHit,
  useTransformAlgoliaHits,
} from 'libs/algolia/fetchAlgolia'
export { parseSearchParameters } from './parseSearchParameters'

export const fetchHits = fetchAlgoliaHits
export const fetchMultipleHits = fetchMultipleAlgolia
export const transformHit = transformAlgoliaHit
export const useTransformHits = useTransformAlgoliaHits
export type SearchHit = AlgoliaHit

export type { Geoloc }
export { attributesToRetrieve, fetchAlgolia, filterSearchHit }