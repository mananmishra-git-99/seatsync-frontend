import { Skeleton } from '@/components/ui/Skeleton'

export function SeatMapSkeleton() {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-4 w-64" />
      </div>
      <div className="rounded-2xl border border-border bg-stage-black p-6">
        <div className="mb-8 flex justify-center">
          <Skeleton className="h-3 w-40" />
        </div>
        <div className="flex flex-col items-center gap-8">
          {[14, 18, 20].map((seatsInRow, sectionIdx) => (
            <div key={sectionIdx} className="flex flex-col items-center gap-2.5">
              <Skeleton className="h-3 w-20" />
              <div className="flex flex-col items-center gap-1.5">
                {Array.from({ length: sectionIdx === 0 ? 6 : sectionIdx === 1 ? 5 : 4 }).map((_, rowIdx) => (
                  <div key={rowIdx} className="flex gap-1.5">
                    {Array.from({ length: seatsInRow }).map((_, seatIdx) => (
                      <Skeleton key={seatIdx} className="size-7.5 rounded-[7px]" />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
