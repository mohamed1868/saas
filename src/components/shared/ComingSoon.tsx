import { Construction } from "lucide-react"
import { useTranslation } from "react-i18next"

export function ComingSoon() {
  const { t } = useTranslation()

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Construction className="size-7" />
      </span>

      <div className="space-y-1.5">
        <h1 className="text-xl font-semibold">{t("soon")}</h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          {t("sectionUnderConstruction")}
        </p>
      </div>
    </div>
  )
}
