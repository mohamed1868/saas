import { TrendingDown, TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts"
import { useTranslation } from "react-i18next"

import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import { SectionCard } from "@/features/private/components/dashboard/SectionCard"
import type { Revenue } from "@/features/private/types/dashboard"
import { cn } from "@/lib/utils"

const SERIES = [
  { key: "current", labelKey: "currentClients", color: "var(--chart-2)" },
  { key: "subscribers", labelKey: "subscribers", color: "var(--chart-1)" },
  { key: "newCustomers", labelKey: "newCustomers", color: "var(--chart-3)" },
]

export function RevenueChart({ revenue, onRefresh }: { revenue: Revenue; onRefresh: () => void }) {
  const { t } = useTranslation()
  const up = revenue.change >= 0
  const Icon = up ? TrendingUp : TrendingDown

  return (
    <SectionCard
      onRefresh={onRefresh}
      className="border-chart-2/50 shadow-lg shadow-chart-2/10"
      title={t("revenueByCustomerType")}
      contentClassName="flex flex-col gap-5"
      action={
        <div className="hidden items-center gap-3 sm:flex">
          {SERIES.map((series) => (
            <span key={series.key} className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="size-2 rounded-full" style={{ backgroundColor: series.color }} />
              {t(series.labelKey)}
            </span>
          ))}
          <span className="rounded-md border border-border px-2 py-1 text-xs text-muted-foreground">
            {revenue.range}
          </span>
        </div>
      }
    >
      <div className="flex items-center gap-3">
        <p className="text-3xl font-semibold tracking-tight">{revenue.total}</p>
        <span
          dir="ltr"
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
            up ? "bg-chart-4/15 text-chart-4" : "bg-destructive/15 text-destructive",
          )}
        >
          <Icon className="size-3" />
          {up ? "+" : ""}
          {revenue.change}%
        </span>
      </div>

      <ChartContainer className="h-64">
        <BarChart data={revenue.series} barGap={2} barCategoryGap="30%">
          <CartesianGrid vertical={false} strokeDasharray="4 4" />
          <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={12} fontSize={11} />
          <YAxis hide />
          <Tooltip
            cursor={{ fill: "var(--accent)", opacity: 0.4 }}
            content={<ChartTooltipContent suffix="K" />}
          />
          {SERIES.map((series) => (
            <Bar
              key={series.key}
              dataKey={series.key}
              name={t(series.labelKey)}
              fill={series.color}
              radius={[4, 4, 0, 0]}
              maxBarSize={9}
            />
          ))}
        </BarChart>
      </ChartContainer>
    </SectionCard>
  )
}
