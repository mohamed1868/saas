import { X } from "lucide-react"
import { useTranslation } from "react-i18next"

import { MultiSelectFilter } from "@/components/shared/MultiSelectFilter"
import { SearchInput } from "@/components/shared/SearchInput"
import { Button } from "@/components/ui/button"
import {
  CUSTOMER_STATUSES,
  CUSTOMER_TYPES,
} from "@/features/private/customers/types/customers"

type CustomersToolbarProps = {
  search: string
  cities: string[]
  selectedCities: string[]
  selectedTypes: string[]
  selectedStatuses: string[]
  onSearchChange: (value: string) => void
  onCitiesChange: (values: string[]) => void
  onTypesChange: (values: string[]) => void
  onStatusesChange: (values: string[]) => void
  onClear: () => void
}

export function CustomersToolbar({
  search,
  cities,
  selectedCities,
  selectedTypes,
  selectedStatuses,
  onSearchChange,
  onCitiesChange,
  onTypesChange,
  onStatusesChange,
  onClear,
}: CustomersToolbarProps) {
  const { t } = useTranslation()
  const dirty =
    search !== "" ||
    selectedCities.length > 0 ||
    selectedTypes.length > 0 ||
    selectedStatuses.length > 0

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
      <SearchInput value={search} placeholder={t("searchCustomers")} onChange={onSearchChange} />

      <div className="flex flex-wrap items-center gap-3">
        <MultiSelectFilter
          placeholder={t("allCities")}
          options={cities.map((city) => ({ value: city, label: city }))}
          selected={selectedCities}
          onChange={onCitiesChange}
        />

        <MultiSelectFilter
          placeholder={t("allTypes")}
          options={CUSTOMER_TYPES.map((type) => ({
            value: type,
            label: t(`customerType_${type}`),
          }))}
          selected={selectedTypes}
          onChange={onTypesChange}
        />

        <MultiSelectFilter
          placeholder={t("allStatuses")}
          options={CUSTOMER_STATUSES.map((status) => ({
            value: status,
            label: t(`customerStatus_${status}`),
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
