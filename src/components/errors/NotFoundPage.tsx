import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { PATHS } from "@/app/router/paths"

export default function NotFoundPage() {
  const { t } = useTranslation()

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 bg-background p-6 text-center">
      <p className="text-6xl font-semibold text-primary">404</p>
      <p className="text-muted-foreground">{t("pageNotFound")}</p>
      <Button asChild>
        <Link to={PATHS.dashboard}>{t("backToDashboard")}</Link>
      </Button>
    </div>
  )
}
