import { Building2, CalendarClock, LogOut, Mail, ShieldCheck, User } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"

import { LanguageSelect } from "@/components/shared/LanguageSelect"
import { ModeToggle } from "@/components/shared/ModeToggle"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { clearSession, daysLeft, getSession } from "@/features/public/lib/session"
import { initialsOf } from "@/lib/utils"
import { PATHS } from "@/app/router/paths"

export default function AccountPage() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()

  const session = getSession()

  if (!session) return null

  const remaining = daysLeft(session.plan)
  const expiry = new Intl.DateTimeFormat(i18n.language, { dateStyle: "long" }).format(
    new Date(session.plan.expiresAt),
  )

  const details = [
    { key: "username", icon: User, value: session.name },
    { key: "email", icon: Mail, value: session.email, ltr: true },
    { key: "companyName", icon: Building2, value: session.company.name },
    { key: "industry", icon: ShieldCheck, value: t(session.company.industryKey) },
  ]

  function logout() {
    clearSession()
    navigate(PATHS.login, { replace: true })
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{t("account")}</h1>
        <p className="text-sm text-muted-foreground">{t("accountSubtitle")}</p>
      </div>

      <Card className="flex flex-wrap items-center gap-4 rounded-xl border-border/70 p-5">
        <Avatar className="size-16">
          <AvatarFallback className="bg-linear-to-br from-primary to-chart-3 text-lg text-white">
            {initialsOf(session.name)}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0">
          <p className="text-lg font-semibold">{session.name}</p>
          <p dir="ltr" className="text-start text-sm text-muted-foreground">
            {session.email}
          </p>
        </div>

        <span className="ms-auto rounded-full bg-primary/15 px-3 py-1 text-sm font-medium text-primary">
          {t(session.plan.nameKey)}
        </span>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="rounded-xl border-border/70 p-5">
          <h2 className="text-sm font-medium">{t("accountDetails")}</h2>

          <ul className="mt-4 grid gap-4">
            {details.map((detail) => (
              <li key={detail.key} className="flex items-center gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                  <detail.icon className="size-4" />
                </span>

                <span className="min-w-0">
                  <span className="block text-xs text-muted-foreground">{t(detail.key)}</span>
                  <span
                    dir={detail.ltr ? "ltr" : undefined}
                    className="block truncate text-start text-sm font-medium"
                  >
                    {detail.value}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="rounded-xl border-border/70 p-5">
          <h2 className="text-sm font-medium">{t("subscription")}</h2>

          <div className="mt-4 flex items-center gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
              <CalendarClock className="size-4" />
            </span>

            <div>
              <p className="text-xs text-muted-foreground">{t("expiresOn")}</p>
              <p className="text-sm font-medium">{expiry}</p>
            </div>

            <span className="ms-auto text-sm text-muted-foreground">
              {t("daysLeft", { days: remaining })}
            </span>
          </div>

          <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-linear-to-r from-chart-2 to-primary"
              style={{ width: `${Math.min(100, (remaining / 365) * 100)}%` }}
            />
          </div>

          <p className="mt-4 text-xs text-muted-foreground">{t("subscriptionNote")}</p>
        </Card>

        <Card className="rounded-xl border-border/70 p-5">
          <h2 className="text-sm font-medium">{t("preferences")}</h2>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <LanguageSelect />
            <ModeToggle />
            <span className="text-xs text-muted-foreground">{t("preferencesNote")}</span>
          </div>
        </Card>

        <Card className="rounded-xl border-border/70 p-5">
          <h2 className="text-sm font-medium">{t("session")}</h2>
          <p className="mt-2 text-xs text-muted-foreground">{t("sessionNote")}</p>

          <Button variant="destructive" className="mt-4" onClick={logout}>
            <LogOut className="size-4 rtl:-scale-x-100" />
            {t("logout")}
          </Button>
        </Card>
      </div>
    </div>
  )
}
