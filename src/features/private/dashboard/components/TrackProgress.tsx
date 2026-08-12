import { useTranslation } from "react-i18next"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { SectionCard } from "@/features/private/dashboard/components/SectionCard"
import type { ProgressItem } from "@/features/private/dashboard/types/dashboard"
import { initialsOf } from "@/lib/utils"

export function TrackProgress({
  items,
  onRefresh,
}: {
  items: ProgressItem[]
  onRefresh: () => void
}) {
  const { t } = useTranslation()

  return (
    <SectionCard title={t("trackProgress")} onRefresh={onRefresh}>
      <ul className="grid gap-5">
        {items.map((item) => (
          <li key={item.id} className="flex items-center gap-3">
            <Avatar className="size-9">
              <AvatarFallback className="bg-secondary text-xs">
                {initialsOf(item.name)}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{item.name}</p>
              <p className="truncate text-xs text-muted-foreground">{item.email}</p>
            </div>

            <div className="flex w-24 shrink-0 items-center gap-2">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-linear-to-r from-chart-2 to-chart-1"
                  style={{ width: `${item.value}%` }}
                />
              </div>
              <span className="text-xs font-medium tabular-nums text-muted-foreground">
                {item.value}%
              </span>
            </div>
          </li>
        ))}
      </ul>
    </SectionCard>
  )
}
