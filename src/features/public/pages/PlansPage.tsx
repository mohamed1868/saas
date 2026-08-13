import { ArrowLeft } from "lucide-react"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"

import logoDark from "@/assets/logo/logoDark.webp"
import logoLight from "@/assets/logo/logoLight.webp"
import { LanguageSelect } from "@/components/shared/LanguageSelect"
import { ModeToggle } from "@/components/shared/ModeToggle"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { getPlans } from "@/features/public/api/plans"
import { PlanCard } from "@/features/public/components/plans/PlanCard"
import { PlanRequestDialog } from "@/features/public/components/plans/PlanRequestDialog"
import type { Plan } from "@/features/public/types/plans"
import { siteConfig } from "@/config/site"
import { PATHS } from "@/app/router/paths"

export default function PlansPage() {
  const { t } = useTranslation()
  const [plans, setPlans] = useState<Plan[]>([])
  const [selected, setSelected] = useState<Plan | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let active = true

    async function loadPlans() {
      try {
        const data = await getPlans()
        if (!active) return
        setPlans(data)
        setError(null)
      } catch {
        if (active) setError("plansLoadFailed")
      } finally {
        if (active) setLoading(false)
      }
    }

    loadPlans()

    return () => {
      active = false
    }
  }, [reloadKey])

  return (
    <div className="relative min-h-svh overflow-hidden bg-background">
      <div className="pointer-events-none absolute -top-48 left-1/2 size-136 -translate-x-1/2 animate-aurora rounded-full bg-primary/15 blur-3xl" />

      <header className="relative z-10 flex items-center justify-between gap-3 p-5 sm:p-8">
        <Link to={PATHS.login} className="flex items-center gap-3">
          <img src={logoLight} alt={siteConfig.name} className="h-8 w-auto dark:hidden" />
          <img src={logoDark} alt={siteConfig.name} className="hidden h-8 w-auto dark:block" />
        </Link>

        <div className="flex items-center gap-2">
          <LanguageSelect />
          <ModeToggle />
          <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
            <Link to={PATHS.login}>
              <ArrowLeft className="size-4 rtl:rotate-180" />
              {t("backToLogin")}
            </Link>
          </Button>
        </div>
      </header>

      <main className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-16 sm:px-8">
        <div className="animate-in fade-in slide-in-from-bottom-3 mx-auto max-w-2xl space-y-3 py-8 text-center duration-700">
          <h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            {t("plansTitle")}
          </h1>
          <p className="text-muted-foreground">{t("plansSubtitle")}</p>
        </div>

        {error && (
          <div className="flex flex-col items-center gap-3 py-10">
            <p className="text-sm text-destructive">{t(error)}</p>
            <Button variant="outline" size="sm" onClick={() => setReloadKey((key) => key + 1)}>
              {t("retry")}
            </Button>
          </div>
        )}

        {!error && (
          <div className="grid items-stretch gap-5 md:grid-cols-3">
            {loading
              ? Array.from({ length: 3 }, (_, index) => (
                  <Card key={index} className="h-104 rounded-2xl border-border/70 p-6">
                    <Skeleton className="size-full" />
                  </Card>
                ))
              : plans.map((plan) => (
                  <PlanCard key={plan.id} plan={plan} onSelect={setSelected} />
                ))}
          </div>
        )}

        <p className="mt-10 text-center text-sm text-muted-foreground">{t("plansFooterNote")}</p>
      </main>

      <PlanRequestDialog plan={selected} onOpenChange={(open) => !open && setSelected(null)} />
    </div>
  )
}
