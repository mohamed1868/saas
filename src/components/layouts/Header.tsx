import { Search } from "lucide-react"
import { useTranslation } from "react-i18next"

import { LanguageSelect } from "@/components/shared/LanguageSelect"
import { ModeToggle } from "@/components/shared/ModeToggle"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

export function Header() {
  const { t } = useTranslation()

  return (
    <header className="flex h-16 shrink-0 items-center gap-3 border-b border-border px-4">
      <SidebarTrigger />
      <Separator orientation="vertical" className="!h-5" />

      <div className="relative max-w-xs flex-1">
        <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder={t("search")} className="ps-9" />
      </div>

      <div className="ms-auto flex items-center gap-2">
        <LanguageSelect />
        <ModeToggle />
      </div>
    </header>
  )
}
