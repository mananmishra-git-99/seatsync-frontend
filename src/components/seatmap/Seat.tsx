import { memo, type KeyboardEvent } from 'react'
import { motion } from 'framer-motion'
import { Accessibility, Check } from 'lucide-react'
import { HoldRing } from './HoldRing'
import { cn } from '@/lib/utils'
import { formatPrice } from '@/lib/format'
import type { Seat as SeatType } from '@/api/types'

interface SeatProps {
  seat: SeatType
  isFocusable: boolean
  isPulsing: boolean
  /** false once a hold is active — available seats stop being
   * selectable, since the selection is locked in for the countdown. */
  isInteractive: boolean
  holdFraction?: number
  onToggle: (seat: SeatType) => void
  onFocus: (seatId: string) => void
  onKeyDown: (e: KeyboardEvent<HTMLButtonElement>, seat: SeatType) => void
  /** Callback-ref so SeatMap can imperatively move focus for arrow-key
   * navigation (memo + a plain function component can't take a real
   * forwardRef without extra ceremony — this is the lighter-weight
   * equivalent). */
  innerRef?: (el: HTMLButtonElement | null) => void
}

export function accessibleSeatName(seat: SeatType): string {
  const parts = [`Seat ${seat.id}`]
  if (seat.accessible) parts.push('wheelchair accessible')
  switch (seat.status) {
    case 'available':
      parts.push('available', formatPrice(seat.price))
      break
    case 'selected':
      parts.push('selected')
      break
    case 'held-mine':
      parts.push('held by you, completing checkout')
      break
    case 'held-other':
      parts.push('held by another shopper, unavailable')
      break
    case 'sold':
      parts.push('sold, unavailable')
      break
  }
  return parts.join(', ')
}

function SeatComponent({
  seat,
  isFocusable,
  isPulsing,
  isInteractive,
  holdFraction,
  onToggle,
  onFocus,
  onKeyDown,
  innerRef,
}: SeatProps) {
  const { status } = seat
  const clickable = status === 'selected' || status === 'held-mine' || (status === 'available' && isInteractive)

  return (
    <motion.button
      ref={innerRef}
      type="button"
      title={`${seat.id} — ${status === 'available' ? formatPrice(seat.price) : status.replace('-', ' ')}`}
      aria-label={accessibleSeatName(seat)}
      aria-pressed={status === 'selected' || status === 'held-mine'}
      disabled={status === 'sold' || status === 'held-other' || (status === 'available' && !isInteractive)}
      tabIndex={isFocusable ? 0 : -1}
      onFocus={() => onFocus(seat.id)}
      onKeyDown={(e) => onKeyDown(e, seat)}
      onClick={() => clickable && onToggle(seat)}
      animate={isPulsing ? { scale: [1, 1.18, 1] } : { scale: 1 }}
      transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
      className={cn(
        'focus-ring relative flex size-7.5 shrink-0 items-center justify-center rounded-[7px] text-[9px] font-medium leading-none transition-colors duration-(--duration-fast)',
        status === 'available' &&
          (isInteractive
            ? 'cursor-pointer border border-border text-ink-faint hover:border-spotlight-violet-bright hover:bg-spotlight-violet/10 hover:text-ink-muted'
            : 'cursor-not-allowed border border-border/50 text-ink-faint/50'),
        (status === 'selected' || status === 'held-mine') &&
          'cursor-pointer bg-marquee-magenta text-stage-black shadow-[0_0_0_1px_var(--color-marquee-magenta)] hover:bg-marquee-magenta/90',
        status === 'held-other' && 'cursor-not-allowed border border-border/60 text-ink-faint/70',
        status === 'sold' && 'cursor-not-allowed border-transparent text-ink-faint/30 opacity-40',
      )}
      style={
        status === 'held-other'
          ? {
              backgroundImage:
                'repeating-linear-gradient(135deg, transparent, transparent 2.5px, var(--color-ink-faint) 2.5px, var(--color-ink-faint) 3.5px)',
              backgroundColor: 'color-mix(in oklab, var(--color-ink-faint) 8%, transparent)',
            }
          : undefined
      }
    >
      {status === 'held-mine' && holdFraction !== undefined && <HoldRing fraction={holdFraction} />}
      {status === 'selected' || status === 'held-mine' ? (
        <Check className="size-3.5" strokeWidth={3} aria-hidden="true" />
      ) : seat.accessible ? (
        <Accessibility className="size-3.5" aria-hidden="true" />
      ) : (
        <span aria-hidden="true">{seat.number}</span>
      )}
    </motion.button>
  )
}

export const Seat = memo(SeatComponent)
