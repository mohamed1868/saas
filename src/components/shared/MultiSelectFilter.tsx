import { ChevronDown, X } from "lucide-react"
import { useTranslation } from "react-i18next"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

type FilterOption = {
  value: string
  label: string
}

type MultiSelectFilterProps = {
  placeholder: string
  options: FilterOption[]
  selected: string[]
  onChange: (values: string[]) => void
  className?: string
}

export function MultiSelectFilter({
  placeholder,
  options,
  selected,
  onChange,
  className,
}: MultiSelectFilterProps) {
  const { t } = useTranslation()

  const first = options.find((option) => option.value === selected[0])
  const summary =
    selected.length === 0
      ? placeholder
      : selected.length === 1
        ? (first?.label ?? placeholder)
        : `${first?.label ?? ""} +${selected.length - 1}`

  function toggle(value: string) {
    onChange(
      selected.includes(value)
        ? selected.filter((item) => item !== value)
        : [...selected, value],
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={cn("h-10 w-44 justify-between gap-2 font-normal", className)}
        >
          <span className={cn("truncate", selected.length === 0 && "text-muted-foreground")}>
            {summary}
          </span>
          <ChevronDown className="size-4 shrink-0 opacity-60" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="max-h-72 w-56 overflow-y-auto">
        {options.map((option) => (
          <DropdownMenuCheckboxItem
            key={option.value}
            checked={selected.includes(option.value)}
            onCheckedChange={() => toggle(option.value)}
            onSelect={(event) => event.preventDefault()}
          >
            {option.label}
          </DropdownMenuCheckboxItem>
        ))}

        {selected.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onChange([])}>
              <X className="size-4" />
              {t("clear")}
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
