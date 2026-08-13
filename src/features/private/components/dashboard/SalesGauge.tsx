import { Cell, Pie, PieChart, Tooltip } from "recharts"
import { useTranslation } from "react-i18next"

import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import { SectionCard } from "@/features/private/components/dashboard/SectionCard"
import type { Segment } from "@/features/private/types/dashboard"

const COLORS = ["var(--chart-2)", "var(--chart-3)", "var(--chart-1)"]

export function SalesGauge({
  value,
  segments,
  onRefresh,
}: {
  value: number
  segments: Segment[]
  onRefresh: () => void
}) {
  const { t } = useTranslation()

  return (
    <SectionCard
      title={t("salesActivity")}
      onRefresh={onRefresh}
      contentClassName="flex flex-col justify-between gap-6"
    >
      <div className="relative mx-auto h-32 w-full max-w-60 overflow-hidden">
        <ChartContainer className="h-64">
          <PieChart>
            <Tooltip cursor={false} content={<ChartTooltipContent suffix="%" />} />
            <Pie
              data={segments}
              dataKey="value"
              nameKey="label"
              startAngle={180}
              endAngle={0}
              innerRadius="72%"
              outerRadius="100%"
              paddingAngle={3}
              cornerRadius={8}
              strokeWidth={0}
            >
              {segments.map((segment, index) => (
                <Cell key={segment.id} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>

        <div className="pointer-events-none absolute inset-x-0 bottom-1 flex flex-col items-center">
          <p dir="ltr" className="text-3xl font-semibold tracking-tight">
            {value}%
          </p>
          <p className="text-xs text-muted-foreground">{t("ofTarget")}</p>
        </div>
      </div>

      <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
        {segments.map((segment, index) => (
          <li key={segment.id} className="flex items-center gap-2 text-xs text-muted-foreground">
            <span
              className="size-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            {segment.label}
          </li>
        ))}
      </ul>
    </SectionCard>
  )
}
