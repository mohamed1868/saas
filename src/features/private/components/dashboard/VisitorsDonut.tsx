import { Cell, Pie, PieChart, Tooltip } from "recharts"
import { useTranslation } from "react-i18next"

import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import { SectionCard } from "@/features/private/components/dashboard/SectionCard"
import type { Segment } from "@/features/private/types/dashboard"

const COLORS = ["var(--chart-2)", "var(--chart-1)", "var(--chart-3)"]

export function VisitorsDonut({
  total,
  segments,
  onRefresh,
}: {
  total: string
  segments: Segment[]
  onRefresh: () => void
}) {
  const { t } = useTranslation()

  return (
    <SectionCard
      title={t("websiteVisitors")}
      onRefresh={onRefresh}
      contentClassName="flex flex-col gap-6"
    >
      <div className="relative mx-auto w-full max-w-56">
        <ChartContainer className="h-52">
          <PieChart>
            <Tooltip cursor={false} content={<ChartTooltipContent suffix="%" />} />
            <Pie
              data={segments}
              dataKey="value"
              nameKey="label"
              innerRadius="74%"
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

        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-3xl font-semibold tracking-tight">{total}</p>
          <p className="text-xs text-muted-foreground">{t("visitors")}</p>
        </div>
      </div>

      <ul className="grid gap-3">
        {segments.map((segment, index) => (
          <li key={segment.id} className="flex items-center gap-2.5 text-sm">
            <span
              className="size-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <span className="truncate text-muted-foreground">{segment.label}</span>
            <span className="ms-auto font-medium tabular-nums">{segment.value}%</span>
          </li>
        ))}
      </ul>
    </SectionCard>
  )
}
