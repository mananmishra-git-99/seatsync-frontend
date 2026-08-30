import { useQuery } from '@tanstack/react-query'
import { delay, ApiError } from './client'
import { MOCK_EVENTS, toSummary } from './mock-events'
import type { EventCategory, EventSummary } from './types'

export interface EventFilters {
  search: string
  category: EventCategory | 'all'
  dateFrom: string | null
  dateTo: string | null
  sortBy: 'date' | 'price'
}

export const DEFAULT_EVENT_FILTERS: EventFilters = {
  search: '',
  category: 'all',
  dateFrom: null,
  dateTo: null,
  sortBy: 'date',
}

function applyFilters(events: EventSummary[], filters: EventFilters): EventSummary[] {
  let result = events

  if (filters.search.trim()) {
    const q = filters.search.trim().toLowerCase()
    result = result.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.venue.toLowerCase().includes(q) ||
        e.city.toLowerCase().includes(q),
    )
  }

  if (filters.category !== 'all') {
    result = result.filter((e) => e.category === filters.category)
  }

  if (filters.dateFrom) {
    const from = new Date(filters.dateFrom).getTime()
    result = result.filter((e) => new Date(e.dateISO).getTime() >= from)
  }
  if (filters.dateTo) {
    // Inclusive of the whole end day.
    const to = new Date(filters.dateTo).getTime() + 24 * 60 * 60 * 1000
    result = result.filter((e) => new Date(e.dateISO).getTime() < to)
  }

  result = [...result].sort((a, b) =>
    filters.sortBy === 'price'
      ? a.startingPrice - b.startingPrice
      : new Date(a.dateISO).getTime() - new Date(b.dateISO).getTime(),
  )

  return result
}

/**
 * Mock now, real API later: swap the queryFn body for
 * `apiFetch<EventSummary[]>('/events?' + new URLSearchParams({...}))` —
 * a GET to Catalog's controller (params ~ same shape as EventFilters,
 * Spring's @RequestParam binds them directly). The hook's return
 * contract stays identical, so Browse Events doesn't change.
 */
export function useEvents(filters: EventFilters) {
  return useQuery({
    queryKey: ['events', filters],
    queryFn: async () => {
      await delay()
      return applyFilters(MOCK_EVENTS.map(toSummary), filters)
    },
    placeholderData: (previous) => previous,
  })
}

/** Real endpoint: GET /events/{id} — a 404 from Spring becomes an
 * ApiError the same way apiFetch already unwraps it. */
export function useEvent(eventId: string | undefined) {
  return useQuery({
    queryKey: ['event', eventId],
    queryFn: async () => {
      await delay()
      const event = MOCK_EVENTS.find((e) => e.id === eventId)
      if (!event) {
        throw new ApiError('This event doesn’t exist or has been removed.', 'NOT_FOUND')
      }
      return event
    },
    enabled: Boolean(eventId),
  })
}
