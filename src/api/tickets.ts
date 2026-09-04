import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { delay } from './client'
import { MOCK_BOOKINGS } from './mock-bookings'
import type { Booking } from './types'

/** Real endpoint: GET /bookings (current user's, via the auth token —
 * no userId param needed once real auth exists). staleTime stays
 * Infinity for the same reason as the seat map: this is a snapshot,
 * not a subscription; nothing here needs live push updates. */
export function useTickets() {
  return useQuery({
    queryKey: ['bookings'],
    queryFn: async () => {
      await delay()
      return MOCK_BOOKINGS
    },
    staleTime: Infinity,
  })
}

export function useTicket(bookingId: string | undefined) {
  const ticketsQuery = useTickets()
  const booking = ticketsQuery.data?.find((b) => b.id === bookingId)
  return { ...ticketsQuery, data: booking }
}

/** Real endpoint: POST /bookings/{id}/cancel */
export function useCancelBooking() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (bookingId: string) => {
      await delay()
      return bookingId
    },
    onSuccess: (bookingId) => {
      queryClient.setQueryData<Booking[]>(['bookings'], (prev) =>
        prev?.map((b) => (b.id === bookingId ? { ...b, status: 'cancelled' as const } : b)),
      )
    },
  })
}
