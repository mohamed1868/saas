import { X } from "lucide-react"
import { useTranslation } from "react-i18next"

import { MultiSelectFilter } from "@/components/shared/MultiSelectFilter"
import { SearchInput } from "@/components/shared/SearchInput"
import { Button } from "@/components/ui/button"
import { INVOICE_STATUSES } from "@/features/private/types/invoices"

type InvoicesToolbarProps = {
  search: string
  selectedStatuses: string[]
  onSearchChange: (value: string) => void
  onStatusesChange: (values: string[]) => void
  onClear: () => void
}

export function InvoicesToolbar({
  search,
  selectedStatuses,
  onSearchChange,
  onStatusesChange,
  onClear,
}: InvoicesToolbarProps) {
  const { t } = useTranslation()
  const dirty = search !== "" || selectedStatuses.length > 0

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
      <SearchInput value={search} placeholder={t("searchInvoices")} onChange={onSearchChange} />

      <div className="flex flex-wrap items-center gap-3">
        <MultiSelectFilter
          placeholder={t("allStatuses")}
          options={INVOICE_STATUSES.map((status) => ({
            value: status,
            label: t(`invoiceStatus_${status}`),
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
