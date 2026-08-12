import { Check, Sparkles } from "lucide-react"
import { useTranslation } from "react-i18next"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { Plan } from "@/features/public/types/plans"
import { cn } from "@/lib/utils"

export function PlanCard({ plan, onSelect }: { plan: Plan; onSelect: (plan: Plan) => void }) {
  const { t } = useTranslation()

  return (
    <Card
      className={cn(
        "relative flex flex-col gap-6 rounded-2xl border-border/70 p-6",
        plan.featured && "border-primary/60 shadow-xl shadow-primary/10",
      )}
    >
      {plan.featured && (
        <span className="absolute -top-3 start-6 inline-flex items-center gap-1 rounded-full bg-linear-to-r from-primary to-chart-3 px-3 py-1 text-xs font-medium text-white">
          <Sparkles className="size-3" />
          {t("mostPopular")}
        </span>
      )}

      <div className="space-y-2">
        <h2 className="text-lg font-semibold">{plan.name}</h2>
        <p className="text-sm text-muted-foreground">{plan.description}</p>
      </div>

      <p className="flex items-baseline gap-1.5">
        <span dir="ltr" className="text-4xl font-semibold tracking-tight">
          {plan.price}
        </span>
        <span className="text-sm text-muted-foreground">{t("perMonth")}</span>
      </p>

      <ul className="grid flex-1 gap-3">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5 text-sm">
            <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-chart-4/15 text-chart-4">
              <Check className="size-3" />
            </span>
            <span className="text-muted-foreground">{feature}</span>
          </li>
        ))}
      </ul>

      <Button
        size="lg"
        variant={plan.featured ? "default" : "outline"}
        onClick={() => onSelect(plan)}
        className={cn(
          "w-full",
          plan.featured && "bg-linear-to-r from-primary to-chart-3 text-white hover:brightness-110",
        )}
      >
        {t("choosePlan")}
      </Button>
    </Card>
  )
}
