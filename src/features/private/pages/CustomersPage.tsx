import { Plus, UsersRound } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"

import { ConfirmDialog } from "@/components/shared/ConfirmDialog"
import { ListCard } from "@/components/shared/ListCard"
import { Button } from "@/components/ui/button"
import { CustomerFormDialog } from "@/features/private/components/customers/CustomerFormDialog"
import { CustomersTable } from "@/features/private/components/customers/CustomersTable"
import { CustomersToolbar } from "@/features/private/components/customers/CustomersToolbar"
import { getCities } from "@/features/private/api/customers"
import type { Customer, CustomerDraft } from "@/features/private/types/customers"
import { useDataScope } from "@/hooks/useDataScope"
import { useRemoteList } from "@/hooks/useRemoteList"
import { usePagedList } from "@/hooks/usePagedList"
import { mergeOptions } from "@/lib/utils"
import {
  customerAdded,
  customerRemoved,
  customerUpdated,
  fetchCustomers,
} from "@/store/customersSlice"
import { useAppDispatch, useAppSelector } from "@/store/hooks"

const PAGE_SIZE = 8

const NO_CUSTOMERS: Customer[] = []

export default function CustomersPage() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()

  const { companyId, scope } = useDataScope()
  const stored = useAppSelector((state) => state.customers.byScope[scope])
  const status = useAppSelector((state) => state.customers.statusByScope[scope] ?? "idle")
  const customers = stored ?? NO_CUSTOMERS
  const remoteCities = useRemoteList(companyId && `cities:${companyId}`, getCities)

  useEffect(() => {
    if (scope && !stored) dispatch(fetchCustomers(scope))
  }, [scope, stored, dispatch])

  const [search, setSearch] = useState("")
  const [selectedCities, setSelectedCities] = useState<string[]>([])
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([])

  const [editing, setEditing] = useState<Customer | null>(null)
  const [creating, setCreating] = useState(false)
  const [deleting, setDeleting] = useState<Customer | null>(null)

  const cities = useMemo(
    () => mergeOptions(remoteCities, customers.map((customer) => customer.city)),
    [remoteCities, customers],
  )

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()

    return customers.filter((customer) => {
      if (selectedCities.length > 0 && !selectedCities.includes(customer.city)) return false
      if (selectedTypes.length > 0 && !selectedTypes.includes(customer.type)) return false
      if (selectedStatuses.length > 0 && !selectedStatuses.includes(customer.status)) return false
      if (!term) return true

      return (
        customer.name.toLowerCase().includes(term) ||
        customer.email.toLowerCase().includes(term) ||
        customer.phone.includes(term)
      )
    })
  }, [customers, search, selectedCities, selectedTypes, selectedStatuses])

  const paged = usePagedList(filtered, PAGE_SIZE)

  function clearFilters() {
    setSearch("")
    setSelectedCities([])
    setSelectedTypes([])
    setSelectedStatuses([])
    paged.resetPage()
  }

  function saveCustomer(draft: CustomerDraft, id?: string) {
    if (id) {
      dispatch(customerUpdated({ scope, id, changes: draft }))
      return
    }

    dispatch(customerAdded({ scope, item: { ...draft, id: crypto.randomUUID() } }))
    paged.resetPage()
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{t("customers")}</h1>
          <p className="text-sm text-muted-foreground">
            {t("customersSubtitle", { count: customers.length })}
          </p>
        </div>

        <Button
          onClick={() => setCreating(true)}
          variant="gradient"
        >
          <Plus className="size-4" />
          {t("addCustomer")}
        </Button>
      </div>

      <CustomersToolbar
        search={search}
        cities={cities}
        selectedCities={selectedCities}
        selectedTypes={selectedTypes}
        selectedStatuses={selectedStatuses}
        onSearchChange={(value) => {
          setSearch(value)
          paged.resetPage()
        }}
        onCitiesChange={(values) => {
          setSelectedCities(values)
          paged.resetPage()
        }}
        onTypesChange={(values) => {
          setSelectedTypes(values)
          paged.resetPage()
        }}
        onStatusesChange={(values) => {
          setSelectedStatuses(values)
          paged.resetPage()
        }}
        onClear={clearFilters}
      />

      <ListCard
        status={status}
        errorText={t("customersLoadFailed")}
        emptyIcon={UsersRound}
        emptyText={t("noCustomers")}
        isEmpty={filtered.length === 0}
        paged={paged}
        onRetry={() => dispatch(fetchCustomers(scope))}
        onClearFilters={clearFilters}
      >
        <CustomersTable customers={paged.visible} onEdit={setEditing} onDelete={setDeleting} />
      </ListCard>

      {(creating || editing) && (
        <CustomerFormDialog
          customer={editing}
          cities={cities}
          onSave={saveCustomer}
          onClose={() => {
            setCreating(false)
            setEditing(null)
          }}
        />
      )}

      {deleting && (
        <ConfirmDialog
          title={t("deleteCustomer")}
          description={t("deleteCustomerBody", { name: deleting.name })}
          confirmLabel={t("delete")}
          onConfirm={() => {
            dispatch(customerRemoved({ scope, id: deleting.id }))
            setDeleting(null)
          }}
          onClose={() => setDeleting(null)}
        />
      )}
    </div>
  )
}
