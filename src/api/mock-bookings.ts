import type { Booking } from './types'
import { MOCK_EVENTS } from './mock-events'

const midnightStatic = MOCK_EVENTS.find((e) => e.id === 'midnight-static-mumbai')!
const glassBangle = MOCK_EVENTS.find((e) => e.id === 'glass-bangle-mumbai')!

/** Seed data for "My Tickets" — two upcoming (tied to real catalog events
 * so "View event" links resolve) and two past, for the Upcoming/Past
 * split and the non-empty dashboard state. */
export const MOCK_BOOKINGS: Booking[] = [
  {
    id: 'SSY-4F82-KQ',
    eventId: midnightStatic.id,
    eventName: midnightStatic.name,
    eventCategory: midnightStatic.category,
    venue: midnightStatic.venue,
    city: midnightStatic.city,
    dateISO: midnightStatic.dateISO,
    seatIds: ['B-7', 'B-8'],
    totalPrice: 6840,
    status: 'upcoming',
    purchasedAtISO: '2026-08-14T11:22:00+05:30',
  },
  {
    id: 'SSY-91C3-TL',
    eventId: glassBangle.id,
    eventName: glassBangle.name,
    eventCategory: glassBangle.category,
    venue: glassBangle.venue,
    city: glassBangle.city,
    dateISO: glassBangle.dateISO,
    seatIds: ['D-4'],
    totalPrice: 649,
    status: 'upcoming',
    purchasedAtISO: '2026-08-19T20:05:00+05:30',
  },
  {
    id: 'SSY-2A05-XM',
    eventId: 'past-summer-sessions',
    eventName: 'Summer Sessions: Rooftop',
    eventCategory: 'concert',
    venue: 'The Quarter',
    city: 'Mumbai',
    dateISO: '2026-06-21T19:00:00+05:30',
    seatIds: ['GA-1', 'GA-2'],
    totalPrice: 2400,
    status: 'past',
    purchasedAtISO: '2026-06-02T09:14:00+05:30',
  },
  {
    id: 'SSY-77E1-BW',
    eventId: 'past-city-derby',
    eventName: 'Mumbai Blaze vs Bengaluru Bees',
    eventCategory: 'sports',
    venue: 'DY Patil Stadium',
    city: 'Navi Mumbai',
    dateISO: '2026-05-30T19:00:00+05:30',
    seatIds: ['K-19'],
    totalPrice: 950,
    status: 'past',
    purchasedAtISO: '2026-05-11T14:48:00+05:30',
  },
]
