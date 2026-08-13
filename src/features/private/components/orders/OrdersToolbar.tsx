import { X } from "lucide-react"
import { useTranslation } from "react-i18next"

import { MultiSelectFilter } from "@/components/shared/MultiSelectFilter"
import { SearchInput } from "@/components/shared/SearchInput"
import { Button } from "@/components/ui/button"
import { ORDER_STATUSES, PAYMENT_STATUSES } from "@/features/private/types/orders"

type OrdersToolbarProps = {
  search: string
  selectedStatuses: string[]
  selectedPayments: string[]
  onSearchChange: (value: string) => void
  onStatusesChange: (values: string[]) => void
  onPaymentsChange: (values: string[]) => void
  onClear: () => void
}

export function OrdersToolbar({
  search,
  selectedStatuses,
  selectedPayments,
  onSearchChange,
  onStatusesChange,
  onPaymentsChange,
  onClear,
}: OrdersToolbarProps) {
  const { t } = useTranslation()
  const dirty = search !== "" || selectedStatuses.length > 0 || selectedPayments.length > 0

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
      <SearchInput value={search} placeholder={t("searchOrders")} onChange={onSearchChange} />

      <div className="flex flex-wrap items-center gap-3">
        <MultiSelectFilter
          placeholder={t("allStatuses")}
          options={ORDER_STATUSES.map((status) => ({
            value: status,
            label: t(`orderStatus_${status}`),
          }))}
          selected={selectedStatuses}
          onChange={onStatusesChange}
        />

        <MultiSelectFilter
          placeholder={t("allPayments")}
          options={PAYMENT_STATUSES.map((payment) => ({
            value: payment,
            label: t(`payment_${payment}`),
          }))}
          selected={selectedPayments}
          onChange={onPaymentsChange}
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
