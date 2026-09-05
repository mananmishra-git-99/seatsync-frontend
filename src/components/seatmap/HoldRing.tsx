const SIZE = 34
const STROKE = 2.5
const RADIUS = (SIZE - STROKE) / 2
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

/** Ring drains clockwise from full as `fraction` (1 -> 0) counts down.
 * Turns from amber to red under the last 20% — paired with the sticky
 * bar's own amber->red text switch at under a minute, same signal in
 * two places. */
export function HoldRing({ fraction }: { fraction: number }) {
  const clamped = Math.max(0, Math.min(1, fraction))
  const offset = CIRCUMFERENCE * (1 - clamped)
  const isUrgent = clamped <= 0.2

  return (
    <svg
      className="pointer-events-none absolute inset-0 -rotate-90"
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      aria-hidden="true"
    >
      <circle
        cx={SIZE / 2}
        cy={SIZE / 2}
        r={RADIUS}
        fill="none"
        strokeWidth={STROKE}
        className="stroke-stage-black/25"
      />
      <circle
        cx={SIZE / 2}
        cy={SIZE / 2}
        r={RADIUS}
        fill="none"
        strokeWidth={STROKE}
        strokeLinecap="round"
        strokeDasharray={CIRCUMFERENCE}
        strokeDashoffset={offset}
        className={isUrgent ? 'stroke-marquee-red' : 'stroke-marquee-amber'}
        style={{ transition: 'stroke-dashoffset 0.25s linear, stroke 0.4s ease' }}
      />
    </svg>
  )
}
