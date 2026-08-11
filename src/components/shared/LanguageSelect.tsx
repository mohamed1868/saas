import { Languages } from "lucide-react"
import { useTranslation } from "react-i18next"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { LANGUAGES } from "@/lib/i18n"

export function LanguageSelect() {
  const { i18n, t } = useTranslation()
  const current = LANGUAGES.find((l) => l.code === i18n.language) ?? LANGUAGES[0]

  function handleChange(code: string) {
    localStorage.setItem("lang", code)
    window.location.reload()
  }

  return (
    <Select value={current.code} onValueChange={handleChange}>
      <SelectTrigger className="h-9 w-[130px]" aria-label={t("language")}>
        <Languages className="size-4 opacity-70" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {LANGUAGES.map((language) => (
          <SelectItem key={language.code} value={language.code}>
            {language.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
