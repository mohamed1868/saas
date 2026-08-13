import * as React from "react"
import { ResponsiveContainer } from "recharts"

import { cn } from "@/lib/utils"

function ChartContainer({
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & { children: React.ReactElement }) {
  return (
    <div
      dir="ltr"
      data-slot="chart"
      className={cn(
        "w-full [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground",
        "[&_.recharts-cartesian-grid_line]:stroke-border/50 [&_.recharts-surface]:outline-none",
        className,
      )}
      {...props}
    >
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  )
}

type TooltipItem = {
  name?: React.ReactNode
  value?: number | string
  color?: string
  dataKey?: string | number
}

function ChartTooltipContent({
  active,
  payload,
  label,
  suffix = "",
}: {
  active?: boolean
  payload?: TooltipItem[]
  label?: React.ReactNode
  suffix?: string
}) {
  if (!active || !payload?.length) return null

  return (
    <div className="min-w-40 rounded-lg border border-border bg-popover/95 p-2.5 text-xs shadow-xl backdrop-blur-sm">
      {label ? <p className="mb-2 font-medium text-popover-foreground">{label}</p> : null}

      <div className="grid gap-1.5">
        {payload.map((item, index) => (
          <div key={`${item.dataKey}-${index}`} className="flex items-center gap-2">
            <span
              className="size-2 shrink-0 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-muted-foreground">{item.name}</span>
            <span className="ms-auto font-medium tabular-nums text-popover-foreground">
              {item.value}
              {suffix}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export { ChartContainer, ChartTooltipContent }
