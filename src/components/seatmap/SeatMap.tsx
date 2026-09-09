import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { Seat } from './Seat'
import { SeatMapLegend } from './SeatMapLegend'
import { SeatMapMobileList } from './SeatMapMobileList'
import type { EventCategory, Seat as SeatType, Venue } from '@/api/types'
import { HOLD_DURATION_SECONDS } from '@/features/booking/BookingContext'

interface FlatRow {
  key: string
  seats: SeatType[]
}

function flattenVenue(venue: Venue): FlatRow[] {
  return venue.sections.flatMap((section) =>
    section.rows.map((row) => ({ key: `${section.id}-${row.row}`, seats: row.seats })),
  )
}

export interface SeatMapProps {
  venue: Venue
  category: EventCategory
  isInteractive: boolean
  holdSecondsRemaining: number
  recentlyChangedSeatIds: Set<string>
  onToggleSeat: (seat: SeatType) => void
}

export function SeatMap({
  venue,
  category,
  isInteractive,
  holdSecondsRemaining,
  recentlyChangedSeatIds,
  onToggleSeat,
}: SeatMapProps) {
  const flatRows = useMemo(() => flattenVenue(venue), [venue])
  const allSeats = useMemo(() => flatRows.flatMap((r) => r.seats), [flatRows])

  const firstSelectableId =
    allSeats.find((s) => s.status === 'selected' || s.status === 'held-mine')?.id ??
    allSeats.find((s) => s.status === 'available')?.id ??
    allSeats[0]?.id
  const [focusedSeatId, setFocusedSeatId] = useState<string | undefined>(firstSelectableId)

  // Guard against two real edge cases: (1) the live "someone else is
  // looking" simulation marks the current roving-tabindex target sold or
  // held-other, or (2) a hold starts while focus sits on an available
  // seat, which locks every other available seat. A disabled button
  // can't receive focus, so either one — left unhandled — could mean Tab
  // skips the whole grid for a keyboard user. Reassign to the next
  // viable seat the moment either happens.
  useEffect(() => {
    const current = allSeats.find((s) => s.id === focusedSeatId)
    const isCurrentDisabled =
      current && (current.status === 'sold' || current.status === 'held-other' || (current.status === 'available' && !isInteractive))
    if (isCurrentDisabled) {
      const fallback =
        allSeats.find((s) => s.status === 'selected' || s.status === 'held-mine') ??
        allSeats.find((s) => s.status === 'available' && isInteractive)
      if (fallback) setFocusedSeatId(fallback.id)
    }
  }, [allSeats, focusedSeatId, isInteractive])

  const seatRefs = useRef(new Map<string, HTMLButtonElement>())
  // Cache one stable ref-callback per seat id instead of creating a new
  // closure on every render (registerRef(seat.id) would otherwise return
  // a fresh function each time, defeating Seat's React.memo and forcing
  // all ~250 seats to re-render on every 250ms countdown tick instead of
  // just the one seat whose ring actually changed).
  const refCallbackCache = useRef(new Map<string, (el: HTMLButtonElement | null) => void>())
  const getRefCallback = useCallback((seatId: string) => {
    let cached = refCallbackCache.current.get(seatId)
    if (!cached) {
      cached = (el) => {
        if (el) seatRefs.current.set(seatId, el)
        else seatRefs.current.delete(seatId)
      }
      refCallbackCache.current.set(seatId, cached)
    }
    return cached
  }, [])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLButtonElement>, seat: SeatType) => {
      if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) return
      e.preventDefault()

      const rowIdx = flatRows.findIndex((r) => r.seats.some((s) => s.id === seat.id))
      if (rowIdx === -1) return
      const seatIdx = flatRows[rowIdx].seats.findIndex((s) => s.id === seat.id)

      let targetRowIdx = rowIdx
      let targetSeatIdx = seatIdx

      if (e.key === 'ArrowLeft') targetSeatIdx = Math.max(0, seatIdx - 1)
      if (e.key === 'ArrowRight') {
        targetSeatIdx = Math.min(flatRows[rowIdx].seats.length - 1, seatIdx + 1)
      }
      if (e.key === 'ArrowUp') targetRowIdx = Math.max(0, rowIdx - 1)
      if (e.key === 'ArrowDown') targetRowIdx = Math.min(flatRows.length - 1, rowIdx + 1)

      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        targetSeatIdx = Math.min(seatIdx, flatRows[targetRowIdx].seats.length - 1)
      }

      const targetSeat = flatRows[targetRowIdx]?.seats[targetSeatIdx]
      if (!targetSeat) return
      setFocusedSeatId(targetSeat.id)
      seatRefs.current.get(targetSeat.id)?.focus()
    },
    [flatRows],
  )

  const stageLabel = category === 'sports' ? 'FIELD / COURT' : 'STAGE'

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold text-ink">Select your seats</h2>
        <SeatMapLegend />
      </div>

      {/* Desktop / tablet: interactive grid. Mobile: list-by-row (see
          SeatMapMobileList) — a dense grid doesn't give usable tap
          targets under ~640px, so this is two presentations of the same
          data rather than one shrunk to fit. */}
      <div className="hidden overflow-x-auto rounded-2xl border border-border bg-stage-black p-6 sm:block">
        <div className="mb-8 flex justify-center">
          <div className="flex flex-col items-center gap-2">
            <div className="h-px w-40 bg-gradient-to-r from-transparent via-spotlight-violet to-transparent" />
            <span className="text-xs font-medium tracking-[0.3em] text-ink-faint">{stageLabel}</span>
          </div>
        </div>

        <div className="flex min-w-max flex-col items-center gap-8">
          {venue.sections.map((section) => (
            <div key={section.id} className="flex flex-col items-center gap-2.5">
              <h3 className="text-xs font-medium uppercase tracking-wide text-ink-muted">{section.name}</h3>
              <div className="flex flex-col items-center gap-1.5">
                {section.rows.map((row) => {
                  const mid = Math.ceil(row.seats.length / 2)
                  const left = row.seats.slice(0, mid)
                  const right = row.seats.slice(mid)
                  return (
                    <div key={row.row} className="flex items-center gap-2.5">
                      <span className="w-4 text-center font-mono text-[10px] text-ink-faint">{row.row}</span>
                      <div className="flex gap-1.5">
                        {left.map((seat) => (
                          <Seat
                            key={seat.id}
                            seat={seat}
                            isFocusable={seat.id === focusedSeatId}
                            isPulsing={recentlyChangedSeatIds.has(seat.id)}
                            isInteractive={isInteractive}
                            holdFraction={
                              seat.status === 'held-mine' ? holdSecondsRemaining / HOLD_DURATION_SECONDS : undefined
                            }
                            onToggle={onToggleSeat}
                            onFocus={setFocusedSeatId}
                            onKeyDown={handleKeyDown}
                            innerRef={getRefCallback(seat.id)}
                          />
                        ))}
                      </div>
                      <div className="w-5" aria-hidden="true" />
                      <div className="flex gap-1.5">
                        {right.map((seat) => (
                          <Seat
                            key={seat.id}
                            seat={seat}
                            isFocusable={seat.id === focusedSeatId}
                            isPulsing={recentlyChangedSeatIds.has(seat.id)}
                            isInteractive={isInteractive}
                            holdFraction={
                              seat.status === 'held-mine' ? holdSecondsRemaining / HOLD_DURATION_SECONDS : undefined
                            }
                            onToggle={onToggleSeat}
                            onFocus={setFocusedSeatId}
                            onKeyDown={handleKeyDown}
                            innerRef={getRefCallback(seat.id)}
                          />
                        ))}
                      </div>
                      <span className="w-4 text-center font-mono text-[10px] text-ink-faint">{row.row}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="sm:hidden">
        <SeatMapMobileList
          venue={venue}
          isInteractive={isInteractive}
          holdSecondsRemaining={holdSecondsRemaining}
          onToggleSeat={onToggleSeat}
        />
      </div>
    </div>
  )
}
