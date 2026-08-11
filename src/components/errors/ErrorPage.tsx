import { useTranslation } from "react-i18next"
import { isRouteErrorResponse, Link, useRouteError } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { PATHS } from "@/app/router/paths"

export default function ErrorPage() {
  const { t } = useTranslation()
  const error = useRouteError()

  let status = ""
  let detail = ""

  if (isRouteErrorResponse(error)) {
    status = String(error.status)
    detail = error.statusText || ""
  } else if (error instanceof Error) {
    detail = error.message
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 bg-background p-6 text-center">
      {status && <p className="text-6xl font-semibold text-destructive">{status}</p>}

      <div className="space-y-1">
        <h1 className="text-xl font-semibold">{t("errorTitle")}</h1>
        <p className="text-sm text-muted-foreground">{t("errorMessage")}</p>
      </div>

      {detail && (
        <pre className="max-w-lg overflow-x-auto rounded-md bg-muted p-3 text-start text-xs text-muted-foreground">
          {detail}
        </pre>
      )}

      <div className="flex gap-2">
        <Button onClick={() => window.location.reload()}>{t("retry")}</Button>
        <Button asChild variant="outline">
          <Link to={PATHS.dashboard}>{t("backToDashboard")}</Link>
        </Button>
      </div>
    </div>
  )
}
