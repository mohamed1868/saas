import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Stat } from "@/features/private/dashboard/types/dashboard"

export function StatCard({ stat }: { stat: Stat }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
      </CardHeader>
      <CardContent className="flex items-baseline gap-2">
        <p className="text-3xl font-semibold">{stat.value}</p>
        <span className={stat.change >= 0 ? "text-sm text-chart-4" : "text-sm text-destructive"}>
          {stat.change >= 0 ? "+" : ""}
          {stat.change}%
        </span>
      </CardContent>
    </Card>
  )
}

export function StatCardSkeleton() {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="h-4 w-24 animate-pulse rounded bg-muted" />
        <div className="mt-3 h-8 w-20 animate-pulse rounded bg-muted" />
      </CardContent>
    </Card>
  )
}
