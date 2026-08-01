import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

import { Button } from "@/components/ui/button"
import { getStats } from "@/features/dashboard/api/stats"
import { StatCard, StatCardSkeleton } from "@/features/dashboard/components/StatCard"
import type { Stat } from "@/features/dashboard/types"

export default function DashboardPage() {
  const { t } = useTranslation()
  const [stats, setStats] = useState<Stat[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await getStats()
        setStats(data)
        setError(null)
      } catch {
        setError("statsLoadFailed")
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [reloadKey])

  function handleRetry() {
    setLoading(true)
    setReloadKey((key) => key + 1)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">{t("welcome")}</h1>
        <p className="text-sm text-muted-foreground">{t("welcomeSubtitle")}</p>
      </div>

      {error && (
        <div className="flex items-center gap-3">
          <p className="text-sm text-destructive">{t(error)}</p>
          <Button variant="outline" size="sm" onClick={handleRetry}>
            {t("retry")}
          </Button>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {loading
          ? Array.from({ length: 4 }, (_, i) => <StatCardSkeleton key={i} />)
          : stats.map((stat) => <StatCard key={stat.id} stat={stat} />)}
      </div>
    </div>
  )
}
