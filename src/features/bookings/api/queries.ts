import { useNetInfo } from '@react-native-community/netinfo'
import { useCallback } from 'react'
import { useQuery, UseQueryResult } from 'react-query'

import { api } from 'api/api'
import { BookingReponse, BookingsResponse } from 'api/gen'
import { QueryKeys } from 'libs/queryKeys'

export function useBookings(options = {}) {
  const networkInfo = useNetInfo()

  return useQuery<BookingsResponse>(QueryKeys.BOOKINGS, () => api.getnativev1bookings(), {
    enabled: networkInfo.isConnected,
    ...options,
  })
}

export function useOngoingOrEndedBooking(id: number): UseQueryResult<BookingReponse | null> {
  const select = useCallback(
    (bookings) => {
      if (!bookings) {
        return null
      }
      const onGoingBooking = bookings.ongoing_bookings.find(
        (item: BookingReponse) => item.id === id
      )
      const endedBooking = bookings.ended_bookings.find((item: BookingReponse) => item.id === id)

      const selected = onGoingBooking || endedBooking
      if (!selected) {
        return null
      }
      return selected
    },
    [id]
  )

  return useBookings({
    select,
  }) as UseQueryResult<BookingReponse | null>
}
