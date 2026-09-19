import { AnimatePresence, motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { formatCountdown, formatPrice } from '@/lib/format'
import { cn } from '@/lib/utils'
import { useCountdownAnnouncement } from '@/hooks/useCountdownAnnouncement'
import type { Seat } from '@/api/types'
import type { BookingPhase } from '@/features/booking/BookingContext'
import { MAX_SEATS } from '@/features/booking/BookingContext'

export function SelectionSummaryBar({
  selectedSeats,
  totalPrice,
  phase,
  holdSecondsRemaining,
  onHold,
  onProceed,
}: {
  selectedSeats: Seat[]
  totalPrice: number
  phase: BookingPhase
  holdSecondsRemaining: number
  onHold: () => void
  onProceed: () => void
}) {
  const visible = selectedSeats.length > 0
  const isUrgent = phase === 'held' && holdSecondsRemaining <= 60
  const announcement = useCountdownAnnouncement(holdSecondsRemaining, phase === 'held')

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 96, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 96, opacity: 0 }}
          transition={{ duration: 0.28, ease: [0.25, 1, 0.5, 1] }}
          className={cn(
            'fixed inset-x-0 bottom-0 z-30 border-t bg-surface/95 backdrop-blur-md',
            phase === 'held' && isUrgent ? 'border-marquee-red/40' : 'border-border',
          )}
        >
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-3 px-4 py-4 sm:px-6">
            <div className="min-w-0">
              <p className="truncate font-mono text-sm text-ink">
                {selectedSeats
                  .map((s) => s.id)
                  .sort()
                  .join(', ')}
              </p>
              <p className="text-sm text-ink-muted">
                {selectedSeats.length} seat{selectedSeats.length !== 1 ? 's' : ''} &middot;{' '}
                {formatPrice(totalPrice)}
                {phase === 'browsing' && selectedSeats.length >= MAX_SEATS && (
                  <span className="ml-1.5 text-marquee-amber">(max {MAX_SEATS} reached)</span>
                )}
              </p>
            </div>

            {phase === 'held' ? (
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="sr-only" aria-live="polite" aria-atomic="true">
                    {announcement}
                  </span>
                  <span
                    aria-hidden="true"
                    className={cn(
                      'font-display text-3xl tabular-nums tracking-wide',
                      isUrgent ? 'text-marquee-red' : 'text-marquee-amber',
                    )}
                  >
                    {formatCountdown(holdSecondsRemaining)}
                  </span>
                </div>
                <Button size="lg" onClick={onProceed}>
                  Proceed to Checkout
                </Button>
              </div>
            ) : (
              <Button size="lg" onClick={onHold}>
                Hold Seats
              </Button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
