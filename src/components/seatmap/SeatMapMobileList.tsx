import { ChevronDown } from 'lucide-react'
import { HoldRing } from './HoldRing'
import { accessibleSeatName } from './Seat'
import { cn } from '@/lib/utils'
import type { Seat, Venue } from '@/api/types'
import { HOLD_DURATION_SECONDS } from '@/features/booking/BookingContext'

const STRIPE_STYLE = {
  backgroundImage:
    'repeating-linear-gradient(135deg, transparent, transparent 2.5px, var(--color-ink-faint) 2.5px, var(--color-ink-faint) 3.5px)',
  backgroundColor: 'color-mix(in oklab, var(--color-ink-faint) 8%, transparent)',
}

function SeatChip({
  seat,
  isInteractive,
  holdFraction,
  onToggle,
}: {
  seat: Seat
  isInteractive: boolean
  holdFraction?: number
  onToggle: (seat: Seat) => void
}) {
  const { status } = seat
  const clickable = status === 'selected' || status === 'held-mine' || (status === 'available' && isInteractive)

  return (
    <button
      type="button"
      aria-label={accessibleSeatName(seat)}
      aria-pressed={status === 'selected' || status === 'held-mine'}
      disabled={status === 'sold' || status === 'held-other' || (status === 'available' && !isInteractive)}
      onClick={() => clickable && onToggle(seat)}
      className={cn(
        'focus-ring relative flex h-11 min-w-11 items-center justify-center rounded-lg px-2 font-mono text-xs transition-colors',
        status === 'available' &&
          (isInteractive
            ? 'border border-border text-ink-muted active:border-spotlight-violet-bright'
            : 'border border-border/50 text-ink-faint/50'),
        (status === 'selected' || status === 'held-mine') && 'bg-marquee-magenta text-stage-black font-semibold',
        status === 'held-other' && 'border border-border/60 text-ink-faint/70',
        status === 'sold' && 'border-transparent text-ink-faint/30 opacity-40',
      )}
      style={status === 'held-other' ? STRIPE_STYLE : undefined}
    >
      {status === 'held-mine' && holdFraction !== undefined && <HoldRing fraction={holdFraction} />}
      {seat.id}
    </button>
  )
}

export function SeatMapMobileList({
  venue,
  isInteractive,
  holdSecondsRemaining,
  onToggleSeat,
}: {
  venue: Venue
  isInteractive: boolean
  holdSecondsRemaining: number
  onToggleSeat: (seat: Seat) => void
}) {
  return (
    <div className="flex flex-col gap-3">
      {venue.sections.map((section, index) => (
        <details
          key={section.id}
          open={index === 0}
          className="group rounded-xl border border-border bg-surface open:pb-2"
        >
          <summary className="focus-ring flex cursor-pointer list-none items-center justify-between rounded-xl p-4 text-sm font-medium text-ink [&::-webkit-details-marker]:hidden">
            {section.name}
            <ChevronDown
              className="size-4 text-ink-muted transition-transform group-open:rotate-180"
              aria-hidden="true"
            />
          </summary>
          <div className="flex flex-col gap-4 border-t border-border p-4">
            {section.rows.map((row) => (
              <div key={row.row}>
                <p className="mb-2 font-mono text-xs uppercase text-ink-muted">Row {row.row}</p>
                <div className="flex flex-wrap gap-2">
                  {row.seats.map((seat) => (
                    <SeatChip
                      key={seat.id}
                      seat={seat}
                      isInteractive={isInteractive}
                      holdFraction={
                        seat.status === 'held-mine' ? holdSecondsRemaining / HOLD_DURATION_SECONDS : undefined
                      }
                      onToggle={onToggleSeat}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </details>
      ))}
      <p className="px-1 text-xs text-ink-faint">
        Tip: seat prices are shown when you select one — see the summary bar below.
      </p>
    </div>
  )
}
