import { TrendingDown, TrendingUp } from "lucide-react"

import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { SectionCard } from "@/features/private/dashboard/components/SectionCard"
import type { Stat } from "@/features/private/dashboard/types/dashboard"
import { cn } from "@/lib/utils"

const DOTS = ["bg-chart-1", "bg-chart-2", "bg-chart-3", "bg-chart-5"]

export function StatCard({
  stat,
  index,
  onRefresh,
}: {
  stat: Stat
  index: number
  onRefresh?: () => void
}) {
  const up = stat.change >= 0
  const Icon = up ? TrendingUp : TrendingDown

  return (
    <SectionCard
      onRefresh={onRefresh}
      contentClassName="flex items-center gap-3"
      title={
        <div className="flex min-w-0 items-center gap-2">
          <span className={cn("size-2.5 shrink-0 rounded-full", DOTS[index % DOTS.length])} />
          <span className="truncate text-sm text-muted-foreground">{stat.label}</span>
        </div>
      }
    >
      <p className="text-2xl font-semibold tracking-tight">{stat.value}</p>

      <span
        dir="ltr"
        className={cn(
          "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
          up ? "bg-chart-4/15 text-chart-4" : "bg-destructive/15 text-destructive",
        )}
      >
        <Icon className="size-3" />
        {up ? "+" : ""}
        {stat.change}%
      </span>
    </SectionCard>
  )
}

export function StatCardSkeleton() {
  return (
    <Card className="flex flex-col gap-4 rounded-xl border-border/70 p-5">
      <Skeleton className="h-4 w-28" />
      <div className="flex items-center gap-3">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
    </Card>
  )
}
