export type EventCategory = 'concert' | 'sports' | 'theatre'

export interface EventSummary {
  id: string
  name: string
  category: EventCategory
  venue: string
  city: string
  /** ISO datetime of the event start. */
  dateISO: string
  startingPrice: number
  seatsFillingFast: boolean
  /** Short one-line teaser for cards. */
  tagline: string
}

export interface EventDetail extends EventSummary {
  description: string
  doorsOpenISO: string
}

// ── Seat map ────────────────────────────────────────────────────────────

export type SeatStatus =
  | 'available'
  | 'selected'
  | 'held-mine'
  | 'held-other'
  | 'sold'

export interface Seat {
  id: string // e.g. "A-14"
  row: string // e.g. "A"
  number: number // e.g. 14
  status: SeatStatus
  price: number
  /** Seats accessible by wheelchair users get flagged, not hidden. */
  accessible?: boolean
}

export interface SeatRow {
  row: string
  seats: Seat[]
}

export interface SeatSection {
  id: string
  name: string // "Orchestra", "Balcony"
  rows: SeatRow[]
}

export interface Venue {
  id: string
  name: string
  city: string
  sections: SeatSection[]
}

// ── Booking / tickets ──────────────────────────────────────────────────

export type BookingStatus = 'upcoming' | 'past' | 'cancelled'

export interface Booking {
  id: string // booking reference, e.g. "SSY-4F82-KQ"
  eventId: string
  eventName: string
  eventCategory: EventCategory
  venue: string
  city: string
  dateISO: string
  seatIds: string[]
  totalPrice: number
  status: BookingStatus
  purchasedAtISO: string
}

// ── Auth ────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: string
  name: string
  email: string
}

/** What a real login/register call returns: the user plus a bearer token
 * for subsequent requests (Spring Security's typical JWT shape). The mock
 * endpoints in api/auth.ts already return this shape so AuthContext has
 * somewhere to put a token today — see api/authToken.ts. */
export interface AuthSession {
  user: AuthUser
  token: string
}
