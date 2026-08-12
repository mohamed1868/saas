import { Search, X } from "lucide-react"
import { useTranslation } from "react-i18next"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ALL_FILTER } from "@/features/private/products/lib/products"
import { PRODUCT_STATUSES } from "@/features/private/products/types/products"

type ProductsToolbarProps = {
  search: string
  category: string
  status: string
  categories: string[]
  onSearchChange: (value: string) => void
  onCategoryChange: (value: string) => void
  onStatusChange: (value: string) => void
  onClear: () => void
}

export function ProductsToolbar({
  search,
  category,
  status,
  categories,
  onSearchChange,
  onCategoryChange,
  onStatusChange,
  onClear,
}: ProductsToolbarProps) {
  const { t } = useTranslation()
  const dirty = search !== "" || category !== ALL_FILTER || status !== ALL_FILTER

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={t("searchProducts")}
          className="h-10 ps-9"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Select value={category} onValueChange={onCategoryChange}>
          <SelectTrigger className="h-10 w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_FILTER}>{t("allCategories")}</SelectItem>
            {categories.map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={status} onValueChange={onStatusChange}>
          <SelectTrigger className="h-10 w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_FILTER}>{t("allStatuses")}</SelectItem>
            {PRODUCT_STATUSES.map((item) => (
              <SelectItem key={item} value={item}>
                {t(`status_${item}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {dirty && (
          <Button variant="ghost" size="sm" onClick={onClear}>
            <X className="size-4" />
            {t("clearFilters")}
          </Button>
        )}
      </div>
    </div>
  )
}
