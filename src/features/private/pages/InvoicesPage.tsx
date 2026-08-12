import { Plus, ReceiptText } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"

import { ConfirmDialog } from "@/components/shared/ConfirmDialog"
import { TablePagination } from "@/components/shared/TablePagination"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { InvoiceDetailsDialog } from "@/features/private/components/invoices/InvoiceDetailsDialog"
import { InvoiceFormDialog } from "@/features/private/components/invoices/InvoiceFormDialog"
import { InvoicesTable } from "@/features/private/components/invoices/InvoicesTable"
import { InvoicesToolbar } from "@/features/private/components/invoices/InvoicesToolbar"
import type { Customer } from "@/features/private/types/customers"
import type {
  Invoice,
  InvoiceDraft,
  InvoiceStatus,
} from "@/features/private/types/invoices"
import type { Product } from "@/features/private/types/products"
import { getSession } from "@/features/public/lib/session"
import { usePagedList } from "@/hooks/usePagedList"
import { dataScope, formatMoney } from "@/lib/utils"
import { fetchCustomers } from "@/store/customersSlice"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import {
  fetchInvoices,
  invoiceAdded,
  invoiceRemoved,
  invoiceUpdated,
} from "@/store/invoicesSlice"
import { fetchProducts } from "@/store/productsSlice"

const PAGE_SIZE = 8

const NO_INVOICES: Invoice[] = []
const NO_CUSTOMERS: Customer[] = []
const NO_PRODUCTS: Product[] = []

function nextNumber(invoices: Invoice[]) {
  const highest = invoices.reduce(
    (max, invoice) => Math.max(max, Number(invoice.number.replace("INV-", "")) || 0),
    2400,
  )

  return `INV-${highest + 1}`
}

export default function InvoicesPage() {
  const { t, i18n } = useTranslation()
  const dispatch = useAppDispatch()

  const companyId = getSession()?.company.id ?? ""
  const scope = companyId ? dataScope(companyId, i18n.language) : ""

  const storedInvoices = useAppSelector((state) => state.invoices.byScope[scope])
  const storedCustomers = useAppSelector((state) => state.customers.byScope[scope])
  const storedProducts = useAppSelector((state) => state.products.byScope[scope])
  const status = useAppSelector((state) => state.invoices.statusByScope[scope] ?? "idle")

  const invoices = storedInvoices ?? NO_INVOICES
  const customers = storedCustomers ?? NO_CUSTOMERS
  const products = storedProducts ?? NO_PRODUCTS

  useEffect(() => {
    if (!scope) return

    if (!storedInvoices) dispatch(fetchInvoices(scope))
    if (!storedCustomers) dispatch(fetchCustomers(scope))
    if (!storedProducts) dispatch(fetchProducts(scope))
  }, [scope, storedInvoices, storedCustomers, storedProducts, dispatch])

  const [search, setSearch] = useState("")
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([])

  const [opened, setOpened] = useState<Invoice | null>(null)
  const [editing, setEditing] = useState<Invoice | null>(null)
  const [creating, setCreating] = useState(false)
  const [deleting, setDeleting] = useState<Invoice | null>(null)

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()

    return invoices.filter((invoice) => {
      if (selectedStatuses.length > 0 && !selectedStatuses.includes(invoice.status)) return false
      if (!term) return true

      return (
        invoice.number.toLowerCase().includes(term) ||
        invoice.customerName.toLowerCase().includes(term)
      )
    })
  }, [invoices, search, selectedStatuses])

  const paged = usePagedList(filtered, PAGE_SIZE)

  const summary = useMemo(() => {
    const paid = invoices
      .filter((invoice) => invoice.status === "paid")
      .reduce((sum, invoice) => sum + invoice.total, 0)

    const outstanding = invoices
      .filter((invoice) => invoice.status === "sent" || invoice.status === "overdue")
      .reduce((sum, invoice) => sum + invoice.total, 0)

    const overdue = invoices.filter((invoice) => invoice.status === "overdue").length

    return { paid, outstanding, overdue }
  }, [invoices])

  const billed = useMemo(
    () => filtered.reduce((sum, invoice) => sum + invoice.total, 0),
    [filtered],
  )

  const current = opened
    ? (invoices.find((invoice) => invoice.id === opened.id) ?? opened)
    : null

  function clearFilters() {
    setSearch("")
    setSelectedStatuses([])
    paged.resetPage()
  }

  function saveInvoice(draft: Omit<InvoiceDraft, "number">, id?: string) {
    if (id) {
      dispatch(invoiceUpdated({ scope, id, changes: draft }))
      return
    }

    dispatch(
      invoiceAdded({
        scope,
        invoice: { ...draft, number: nextNumber(invoices), id: crypto.randomUUID() },
      }),
    )
    paged.resetPage()
  }

  function changeStatus(next: InvoiceStatus) {
    if (!current) return

    dispatch(invoiceUpdated({ scope, id: current.id, changes: { status: next } }))
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{t("invoices")}</h1>
          <p className="text-sm text-muted-foreground">
            {t("invoicesSubtitle", { count: filtered.length, billed: billed.toFixed(2) })}
          </p>
        </div>

        <Button
          onClick={() => setCreating(true)}
          className="bg-linear-to-r from-primary to-chart-3 text-white hover:brightness-110"
        >
          <Plus className="size-4" />
          {t("newInvoice")}
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="rounded-xl border-border/70 p-4">
          <p className="text-xs text-muted-foreground">{t("paidTotal")}</p>
          <p dir="ltr" className="mt-1 text-xl font-semibold tabular-nums text-chart-4">
            {formatMoney(summary.paid)}
          </p>
        </Card>

        <Card className="rounded-xl border-border/70 p-4">
          <p className="text-xs text-muted-foreground">{t("outstandingTotal")}</p>
          <p dir="ltr" className="mt-1 text-xl font-semibold tabular-nums">
            {formatMoney(summary.outstanding)}
          </p>
        </Card>

        <Card className="rounded-xl border-border/70 p-4">
          <p className="text-xs text-muted-foreground">{t("overdueInvoices")}</p>
          <p className="mt-1 text-xl font-semibold tabular-nums text-destructive">
            {summary.overdue}
          </p>
        </Card>
      </div>

      <InvoicesToolbar
        search={search}
        selectedStatuses={selectedStatuses}
        onSearchChange={(value) => {
          setSearch(value)
          paged.resetPage()
        }}
        onStatusesChange={(values) => {
          setSelectedStatuses(values)
          paged.resetPage()
        }}
        onClear={clearFilters}
      />

      <Card className="overflow-hidden rounded-xl border-border/70">
        {status === "loading" ? (
          <div className="space-y-3 p-5">
            {Array.from({ length: 6 }, (_, index) => (
              <Skeleton key={index} className="h-12 w-full" />
            ))}
          </div>
        ) : status === "failed" ? (
          <div className="flex flex-col items-center gap-3 p-10">
            <p className="text-sm text-destructive">{t("invoicesLoadFailed")}</p>
            <Button variant="outline" size="sm" onClick={() => dispatch(fetchInvoices(scope))}>
              {t("retry")}
            </Button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-3 p-12 text-center">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
              <ReceiptText className="size-6" />
            </span>
            <p className="text-sm text-muted-foreground">{t("noInvoices")}</p>
            <Button variant="outline" size="sm" onClick={clearFilters}>
              {t("clearFilters")}
            </Button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <InvoicesTable
                invoices={paged.visible}
                onOpen={setOpened}
                onEdit={setEditing}
                onDelete={setDeleting}
              />
            </div>

            <TablePagination
              page={paged.page}
              pageCount={paged.pageCount}
              from={paged.from}
              to={paged.to}
              total={paged.total}
              onPageChange={paged.setPage}
            />
          </>
        )}
      </Card>

      {(creating || editing) && (
        <InvoiceFormDialog
          invoice={editing}
          customers={customers}
          products={products}
          onSave={saveInvoice}
          onClose={() => {
            setCreating(false)
            setEditing(null)
          }}
        />
      )}

      {current && (
        <InvoiceDetailsDialog
          invoice={current}
          onStatusChange={changeStatus}
          onClose={() => setOpened(null)}
        />
      )}

      {deleting && (
        <ConfirmDialog
          title={t("deleteInvoice")}
          description={t("deleteInvoiceBody", { number: deleting.number })}
          confirmLabel={t("delete")}
          onConfirm={() => {
            dispatch(invoiceRemoved({ scope, id: deleting.id }))
            setDeleting(null)
          }}
          onClose={() => setDeleting(null)}
        />
      )}
    </div>
  )
}
