import { BellOff, CheckCheck, LifeBuoy, Package, ShoppingCart, Sparkles, Trash2 } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"

import { MultiSelectFilter } from "@/components/shared/MultiSelectFilter"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  NOTIFICATION_TYPES,
  type Notification,
  type NotificationType,
} from "@/features/private/types/notifications"
import { useDataScope } from "@/hooks/useDataScope"
import { cn, formatDateTime } from "@/lib/utils"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import {
  allNotificationsRead,
  fetchNotifications,
  notificationRead,
  notificationRemoved,
} from "@/store/notificationsSlice"

const NO_NOTIFICATIONS: Notification[] = []

const TYPE_ICONS: Record<NotificationType, typeof Package> = {
  order: ShoppingCart,
  stock: Package,
  support: LifeBuoy,
  system: Sparkles,
}

const TYPE_STYLES: Record<NotificationType, string> = {
  order: "bg-chart-2/15 text-chart-2",
  stock: "bg-chart-5/15 text-chart-5",
  support: "bg-chart-3/15 text-chart-3",
  system: "bg-chart-1/15 text-chart-1",
}

export default function NotificationsPage() {
  const { t, i18n } = useTranslation()
  const dispatch = useAppDispatch()

  const { scope } = useDataScope()

  const stored = useAppSelector((state) => state.notifications.byScope[scope])
  const status = useAppSelector((state) => state.notifications.statusByScope[scope] ?? "idle")
  const notifications = stored ?? NO_NOTIFICATIONS

  useEffect(() => {
    if (scope && !stored) dispatch(fetchNotifications(scope))
  }, [scope, stored, dispatch])

  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [unreadOnly, setUnreadOnly] = useState(false)

  const unreadCount = notifications.filter((item) => !item.read).length

  const filtered = useMemo(
    () =>
      notifications.filter((item) => {
        if (unreadOnly && item.read) return false
        if (selectedTypes.length > 0 && !selectedTypes.includes(item.type)) return false

        return true
      }),
    [notifications, selectedTypes, unreadOnly],
  )

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{t("notifications")}</h1>
          <p className="text-sm text-muted-foreground">
            {t("notificationsSubtitle", { count: unreadCount })}
          </p>
        </div>

        <Button
          variant="outline"
          disabled={unreadCount === 0}
          onClick={() => dispatch(allNotificationsRead({ scope }))}
        >
          <CheckCheck className="size-4" />
          {t("markAllRead")}
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <MultiSelectFilter
          placeholder={t("allTypes")}
          options={NOTIFICATION_TYPES.map((type) => ({
            value: type,
            label: t(`notificationType_${type}`),
          }))}
          selected={selectedTypes}
          onChange={setSelectedTypes}
        />

        <Button
          variant={unreadOnly ? "default" : "outline"}
          onClick={() => setUnreadOnly((value) => !value)}
        >
          {t("unreadOnly")}
        </Button>
      </div>

      {status === "loading" ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }, (_, index) => (
            <Skeleton key={index} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      ) : status === "failed" ? (
        <Card className="flex flex-col items-center gap-3 rounded-xl border-border/70 p-10">
          <p className="text-sm text-destructive">{t("notificationsLoadFailed")}</p>
          <Button variant="outline" size="sm" onClick={() => dispatch(fetchNotifications(scope))}>
            {t("retry")}
          </Button>
        </Card>
      ) : filtered.length === 0 ? (
        <Card className="flex flex-col items-center gap-3 rounded-xl border-border/70 p-12 text-center">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
            <BellOff className="size-6" />
          </span>
          <p className="text-sm text-muted-foreground">{t("noNotifications")}</p>
        </Card>
      ) : (
        <ul className="grid gap-3">
          {filtered.map((item) => {
            const Icon = TYPE_ICONS[item.type]

            return (
              <li key={item.id}>
                <Card
                  className={cn(
                    "flex items-start gap-3 rounded-xl border-border/70 p-4",
                    !item.read && "border-primary/40 bg-primary/5",
                  )}
                >
                  <span
                    className={cn(
                      "flex size-10 shrink-0 items-center justify-center rounded-xl",
                      TYPE_STYLES[item.type],
                    )}
                  >
                    <Icon className="size-5" />
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-medium">{item.title}</p>
                      {!item.read && (
                        <span className="rounded-full bg-primary/15 px-2 py-0.5 text-xs text-primary">
                          {t("new")}
                        </span>
                      )}
                    </div>

                    <p className="mt-1 text-sm text-muted-foreground">{item.body}</p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {formatDateTime(item.at, i18n.language)}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-1">
                    {!item.read && (
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label={t("markRead")}
                        onClick={() => dispatch(notificationRead({ scope, id: item.id }))}
                      >
                        <CheckCheck className="size-4" />
                      </Button>
                    )}

                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label={t("delete")}
                      className="text-destructive hover:text-destructive"
                      onClick={() => dispatch(notificationRemoved({ scope, id: item.id }))}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </Card>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
