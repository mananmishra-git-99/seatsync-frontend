import type { EventDetail, EventSummary } from './types'

export interface MockEvent extends EventDetail {}

export const MOCK_EVENTS: MockEvent[] = [
  {
    id: 'midnight-static-mumbai',
    name: 'Midnight Static',
    category: 'concert',
    venue: 'NSCI Dome',
    city: 'Mumbai',
    dateISO: '2026-09-12T19:30:00+05:30',
    doorsOpenISO: '2026-09-12T18:00:00+05:30',
    startingPrice: 1899,
    seatsFillingFast: true,
    tagline: 'Indie rock, one night only — their first arena show.',
    description:
      "Midnight Static bring their genre-bending live set to Mumbai for the first time, off the back of a sold-out club tour. Expect the full-band arrangement of their last two records plus at least one song nobody's heard yet.",
  },
  {
    id: 'anaya-sen-live-delhi',
    name: 'Anaya Sen: Live',
    category: 'concert',
    venue: 'Jawaharlal Nehru Stadium',
    city: 'New Delhi',
    dateISO: '2026-10-03T19:00:00+05:30',
    doorsOpenISO: '2026-10-03T17:30:00+05:30',
    startingPrice: 2499,
    seatsFillingFast: false,
    tagline: 'An intimate set, blown up to stadium scale.',
    description:
      "Anaya Sen's fourth tour trades the usual pyrotechnics for a stripped-back stage built around a twelve-piece string section. Reviewers have called it her most personal show yet.",
  },
  {
    id: 'monsoon-beats-pune',
    name: 'Monsoon Beats Festival',
    category: 'concert',
    venue: 'Mahalunge Grounds',
    city: 'Pune',
    dateISO: '2026-09-26T16:00:00+05:30',
    doorsOpenISO: '2026-09-26T15:00:00+05:30',
    startingPrice: 3200,
    seatsFillingFast: true,
    tagline: 'Two stages, eleven acts, one very long day.',
    description:
      'A single-day festival spanning electronic, indie, and fusion acts across two stages. General standing plus a limited seated terrace for anyone who wants to sit the last set out.',
  },
  {
    id: 'blaze-vs-panthers-mumbai',
    name: 'Mumbai Blaze vs Pune Panthers',
    category: 'sports',
    venue: 'DY Patil Stadium',
    city: 'Navi Mumbai',
    dateISO: '2026-09-18T19:00:00+05:30',
    doorsOpenISO: '2026-09-18T17:00:00+05:30',
    startingPrice: 899,
    seatsFillingFast: true,
    tagline: 'Derby night. Table-toppers vs. last year’s runners-up.',
    description:
      'The season’s first derby between two sides separated by a single point on the table. Blaze are unbeaten at home this year — Panthers haven’t lost an away fixture since March.',
  },
  {
    id: 'bulls-vs-titans-bengaluru',
    name: 'Bengaluru Bulls vs Chennai Titans',
    category: 'sports',
    venue: 'Kanteerava Indoor Stadium',
    city: 'Bengaluru',
    dateISO: '2026-10-10T18:30:00+05:30',
    doorsOpenISO: '2026-10-10T17:00:00+05:30',
    startingPrice: 799,
    seatsFillingFast: false,
    tagline: 'Pro Kabaddi League — knockout stage.',
    description:
      'Win and advance. The Bulls come in as favourites on raid points, but the Titans have the league’s best defensive unit this season.',
  },
  {
    id: 'india-open-badminton-hyderabad',
    name: 'India Open — Finals Day',
    category: 'sports',
    venue: 'Gachibowli Indoor Stadium',
    city: 'Hyderabad',
    dateISO: '2026-11-08T14:00:00+05:30',
    doorsOpenISO: '2026-11-08T12:30:00+05:30',
    startingPrice: 1199,
    seatsFillingFast: false,
    tagline: 'Singles and doubles finals, back to back.',
    description:
      'The last day of the tournament — men’s and women’s singles finals followed by mixed doubles. Courtside sections get you close enough to hear the shuttle.',
  },
  {
    id: 'glass-bangle-mumbai',
    name: 'The Glass Bangle',
    category: 'theatre',
    venue: 'Prithvi Theatre',
    city: 'Mumbai',
    dateISO: '2026-09-05T20:00:00+05:30',
    doorsOpenISO: '2026-09-05T19:15:00+05:30',
    startingPrice: 649,
    seatsFillingFast: true,
    tagline: 'A three-generation family drama, ninety minutes, no interval.',
    description:
      'A revival of the acclaimed 2019 production — three women, one kitchen table, and forty years of things left unsaid. Small house, so the back row is closer than you’d think.',
  },
  {
    id: 'cabaret-nights-bengaluru',
    name: 'Cabaret Nights: A Musical',
    category: 'theatre',
    venue: 'Chowdiah Memorial Hall',
    city: 'Bengaluru',
    dateISO: '2026-10-24T19:30:00+05:30',
    doorsOpenISO: '2026-10-24T18:30:00+05:30',
    startingPrice: 899,
    seatsFillingFast: false,
    tagline: 'A full-band musical revue, back for one more run.',
    description:
      'Fourteen songs, a nine-piece live band, and a cast that’s been touring this revue for two years straight. Comes with a genuine 20-minute interval — no rush to the bar.',
  },
  {
    id: 'winter-light-delhi',
    name: 'Winter Light',
    category: 'theatre',
    venue: 'Kamani Auditorium',
    city: 'New Delhi',
    dateISO: '2026-12-19T19:00:00+05:30',
    doorsOpenISO: '2026-12-19T18:15:00+05:30',
    startingPrice: 749,
    seatsFillingFast: false,
    tagline: 'A quiet two-hander about a very long winter.',
    description:
      'Two actors, one set, one very cold night on stage. A slow-burn script that’s picked up a handful of festival mentions this year — worth going in without reading too much about it first.',
  },
]

export function toSummary(event: MockEvent): EventSummary {
  const { description: _description, doorsOpenISO: _doorsOpenISO, ...summary } = event
  return summary
}
