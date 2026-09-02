import type { EventCategory, Seat, SeatSection, SeatStatus, Venue } from './types'
import { MOCK_EVENTS } from './mock-events'

/** Tiny deterministic PRNG (mulberry32) seeded from the event id, so a
 * given event's seat map — layout, which seats are sold — is stable
 * across reloads instead of reshuffling every render. */
function mulberry32(seed: number) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function hashSeed(str: string): number {
  let h = 0
  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0
  }
  return h
}

interface SectionBlueprint {
  name: string
  rowCount: number
  seatsPerRow: number
  priceMultiplier: number
  /** Baseline fraction already sold before the live simulation kicks in. */
  soldRate: number
}

function blueprintFor(category: EventCategory): SectionBlueprint[] {
  const names: Record<EventCategory, [string, string, string]> = {
    concert: ['Orchestra', 'Mezzanine', 'Balcony'],
    theatre: ['Orchestra', 'Mezzanine', 'Balcony'],
    sports: ['Pitch View', 'Lower Tier', 'Upper Tier'],
  }
  const [front, mid, back] = names[category]
  return [
    { name: front, rowCount: 6, seatsPerRow: 14, priceMultiplier: 1.8, soldRate: 0.4 },
    { name: mid, rowCount: 5, seatsPerRow: 18, priceMultiplier: 1.3, soldRate: 0.28 },
    { name: back, rowCount: 4, seatsPerRow: 20, priceMultiplier: 1.0, soldRate: 0.16 },
  ]
}

const ROW_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

function buildSection(
  blueprint: SectionBlueprint,
  basePrice: number,
  fillingFast: boolean,
  rng: () => number,
): SeatSection {
  const soldRate = fillingFast ? blueprint.soldRate + 0.24 : blueprint.soldRate
  const price = Math.round((basePrice * blueprint.priceMultiplier) / 10) * 10

  const rows = Array.from({ length: blueprint.rowCount }, (_, rowIdx) => {
    const rowLetter = ROW_LETTERS[rowIdx]
    // Front rows of the front section sell out fastest — realistic bias
    // rather than uniform randomness across the whole section.
    const rowBias = 1 - rowIdx / (blueprint.rowCount * 1.6)

    const seats: Seat[] = Array.from({ length: blueprint.seatsPerRow }, (_, seatIdx) => {
      const number = seatIdx + 1
      const roll = rng()
      let status: SeatStatus = 'available'
      if (roll < soldRate * rowBias) {
        status = 'sold'
      } else if (roll < soldRate * rowBias + 0.03) {
        status = 'held-other'
      }
      // Aisle-end seats in the back section, one pair per row, flagged accessible.
      const accessible =
        blueprint.name.includes('Balcony' as string) || blueprint.name === 'Upper Tier'
          ? seatIdx === 0 && rowIdx === blueprint.rowCount - 1
          : false

      return {
        id: `${rowLetter}-${number}`,
        row: rowLetter,
        number,
        status,
        price,
        accessible,
      }
    })

    return { row: rowLetter, seats }
  })

  return {
    id: blueprint.name.toLowerCase().replace(/\s+/g, '-'),
    name: blueprint.name,
    rows,
  }
}

const cache = new Map<string, Venue>()

export function generateVenueSeatMap(eventId: string): Venue {
  const cached = cache.get(eventId)
  if (cached) return cached

  const event = MOCK_EVENTS.find((e) => e.id === eventId)
  if (!event) {
    throw new Error(`No mock event found for id "${eventId}"`)
  }

  const rng = mulberry32(hashSeed(eventId))
  const blueprints = blueprintFor(event.category)
  const sections = blueprints.map((bp) =>
    buildSection(bp, event.startingPrice, event.seatsFillingFast, rng),
  )

  const venue: Venue = {
    id: `${eventId}-venue`,
    name: event.venue,
    city: event.city,
    sections,
  }

  cache.set(eventId, venue)
  return venue
}

export function clearSeatMapCache(eventId?: string) {
  if (eventId) cache.delete(eventId)
  else cache.clear()
}
