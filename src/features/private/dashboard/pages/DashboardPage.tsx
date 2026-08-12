import { useCallback, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { getOverview } from "@/features/private/dashboard/api/overview"
import { OrdersTable } from "@/features/private/dashboard/components/OrdersTable"
import { RevenueChart } from "@/features/private/dashboard/components/RevenueChart"
import { SalesGauge } from "@/features/private/dashboard/components/SalesGauge"
import { StatCard, StatCardSkeleton } from "@/features/private/dashboard/components/StatCard"
import { TopProducts } from "@/features/private/dashboard/components/TopProducts"
import { TrackProgress } from "@/features/private/dashboard/components/TrackProgress"
import { VisitorsDonut } from "@/features/private/dashboard/components/VisitorsDonut"
import type { Overview } from "@/features/private/dashboard/types/dashboard"

function CardSkeleton({ className }: { className?: string }) {
  return (
    <Card className={className}>
      <Skeleton className="size-full rounded-xl" />
    </Card>
  )
}

export default function DashboardPage() {
  const { t } = useTranslation()
  const [overview, setOverview] = useState<Overview | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let active = true

    async function loadOverview() {
      try {
        const data = await getOverview()
        if (!active) return
        setOverview(data)
        setError(null)
      } catch {
        if (active) setError("overviewLoadFailed")
      } finally {
        if (active) setLoading(false)
      }
    }

    loadOverview()

    return () => {
      active = false
    }
  }, [reloadKey])

  const reload = useCallback(() => {
    setLoading(true)
    setReloadKey((key) => key + 1)
  }, [])

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{t("analytics")}</h1>
          <p className="text-sm text-muted-foreground">{t("welcomeSubtitle")}</p>
        </div>

        {error && (
          <div className="flex items-center gap-3">
            <p className="text-sm text-destructive">{t(error)}</p>
            <Button variant="outline" size="sm" onClick={reload}>
              {t("retry")}
            </Button>
          </div>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {loading || !overview
          ? Array.from({ length: 4 }, (_, index) => <StatCardSkeleton key={index} />)
          : overview.stats.map((stat, index) => (
              <StatCard key={stat.id} stat={stat} index={index} onRefresh={reload} />
            ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.75fr)]">
        {loading || !overview ? (
          <>
            <CardSkeleton className="h-105" />
            <CardSkeleton className="h-105" />
          </>
        ) : (
          <>
            <VisitorsDonut
              total={overview.visitors.total}
              segments={overview.visitors.segments}
              onRefresh={reload}
            />
            <RevenueChart revenue={overview.revenue} onRefresh={reload} />
          </>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {loading || !overview ? (
          Array.from({ length: 3 }, (_, index) => <CardSkeleton key={index} className="h-64" />)
        ) : (
          <>
            <TopProducts products={overview.products} onRefresh={reload} />
            <TrackProgress items={overview.progress} onRefresh={reload} />
            <SalesGauge
              value={overview.sales.value}
              segments={overview.sales.segments}
              onRefresh={reload}
            />
          </>
        )}
      </div>

      {loading || !overview ? (
        <CardSkeleton className="h-96" />
      ) : (
        <OrdersTable orders={overview.orders} onRefresh={reload} />
      )}
    </div>
  )
}
