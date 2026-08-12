import { Search, X } from "lucide-react"
import { useTranslation } from "react-i18next"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type SearchInputProps = {
  value: string
  placeholder: string
  onChange: (value: string) => void
}

export function SearchInput({ value, placeholder, onChange }: SearchInputProps) {
  const { t } = useTranslation()

  return (
    <div className="relative flex-1">
      <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-10 px-9"
      />

      {value && (
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={t("clear")}
          className="absolute end-1 top-1/2 -translate-y-1/2 text-muted-foreground"
          onClick={() => onChange("")}
        >
          <X className="size-4" />
        </Button>
      )}
    </div>
  )
}
