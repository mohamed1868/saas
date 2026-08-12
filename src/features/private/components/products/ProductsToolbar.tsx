import { X } from "lucide-react"
import { useTranslation } from "react-i18next"

import { MultiSelectFilter } from "@/components/shared/MultiSelectFilter"
import { SearchInput } from "@/components/shared/SearchInput"
import { Button } from "@/components/ui/button"
import { PRODUCT_STATUSES } from "@/features/private/types/products"

type ProductsToolbarProps = {
  search: string
  categories: string[]
  selectedCategories: string[]
  selectedStatuses: string[]
  onSearchChange: (value: string) => void
  onCategoriesChange: (values: string[]) => void
  onStatusesChange: (values: string[]) => void
  onClear: () => void
}

export function ProductsToolbar({
  search,
  categories,
  selectedCategories,
  selectedStatuses,
  onSearchChange,
  onCategoriesChange,
  onStatusesChange,
  onClear,
}: ProductsToolbarProps) {
  const { t } = useTranslation()
  const dirty = search !== "" || selectedCategories.length > 0 || selectedStatuses.length > 0

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
      <SearchInput value={search} placeholder={t("searchProducts")} onChange={onSearchChange} />

      <div className="flex flex-wrap items-center gap-3">
        <MultiSelectFilter
          placeholder={t("allCategories")}
          options={categories.map((category) => ({ value: category, label: category }))}
          selected={selectedCategories}
          onChange={onCategoriesChange}
        />

        <MultiSelectFilter
          placeholder={t("allStatuses")}
          options={PRODUCT_STATUSES.map((status) => ({
            value: status,
            label: t(`status_${status}`),
          }))}
          selected={selectedStatuses}
          onChange={onStatusesChange}
        />

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
