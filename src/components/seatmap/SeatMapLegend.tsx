import { Accessibility, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

const STRIPE_STYLE = {
  backgroundImage:
    'repeating-linear-gradient(135deg, transparent, transparent 2px, var(--color-ink-faint) 2px, var(--color-ink-faint) 3px)',
  backgroundColor: 'color-mix(in oklab, var(--color-ink-faint) 8%, transparent)',
}

const items = [
  { label: 'Available', swatchClass: 'border border-border' },
  { label: 'Selected / held by you', swatchClass: 'bg-marquee-magenta', icon: Check },
  { label: 'Held by another shopper', swatchClass: '', style: STRIPE_STYLE },
  { label: 'Sold', swatchClass: 'bg-ink-faint/20 opacity-50' },
]

export function SeatMapLegend() {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-ink-muted">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-2">
          <span
            className={cn(
              'flex size-5 shrink-0 items-center justify-center rounded-[5px] text-stage-black',
              item.swatchClass,
            )}
            style={item.style}
            aria-hidden="true"
          >
            {item.icon && <item.icon className="size-3" strokeWidth={3} />}
          </span>
          {item.label}
        </div>
      ))}
      <div className="flex items-center gap-2">
        <Accessibility className="size-4" aria-hidden="true" />
        Wheelchair accessible
      </div>
    </div>
  )
}
