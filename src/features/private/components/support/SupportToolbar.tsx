import { X } from "lucide-react"
import { useTranslation } from "react-i18next"

import { MultiSelectFilter } from "@/components/shared/MultiSelectFilter"
import { SearchInput } from "@/components/shared/SearchInput"
import { Button } from "@/components/ui/button"
import { TICKET_PRIORITIES, TICKET_STATUSES } from "@/features/private/types/support"

type SupportToolbarProps = {
  search: string
  selectedStatuses: string[]
  selectedPriorities: string[]
  onSearchChange: (value: string) => void
  onStatusesChange: (values: string[]) => void
  onPrioritiesChange: (values: string[]) => void
  onClear: () => void
}

export function SupportToolbar({
  search,
  selectedStatuses,
  selectedPriorities,
  onSearchChange,
  onStatusesChange,
  onPrioritiesChange,
  onClear,
}: SupportToolbarProps) {
  const { t } = useTranslation()
  const dirty = search !== "" || selectedStatuses.length > 0 || selectedPriorities.length > 0

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
      <SearchInput value={search} placeholder={t("searchTickets")} onChange={onSearchChange} />

      <div className="flex flex-wrap items-center gap-3">
        <MultiSelectFilter
          placeholder={t("allStatuses")}
          options={TICKET_STATUSES.map((status) => ({
            value: status,
            label: t(`ticketStatus_${status}`),
          }))}
          selected={selectedStatuses}
          onChange={onStatusesChange}
        />

        <MultiSelectFilter
          placeholder={t("allPriorities")}
          options={TICKET_PRIORITIES.map((priority) => ({
            value: priority,
            label: t(`ticketPriority_${priority}`),
          }))}
          selected={selectedPriorities}
          onChange={onPrioritiesChange}
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
