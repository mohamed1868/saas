import { Plus, ShoppingCart } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"

import { ConfirmDialog } from "@/components/shared/ConfirmDialog"
import { ListCard } from "@/components/shared/ListCard"
import { Button } from "@/components/ui/button"
import { OrderFormDialog } from "@/features/private/components/orders/OrderFormDialog"
import { OrdersTable } from "@/features/private/components/orders/OrdersTable"
import { OrdersToolbar } from "@/features/private/components/orders/OrdersToolbar"
import type { Customer } from "@/features/private/types/customers"
import type { Order, OrderDraft } from "@/features/private/types/orders"
import type { Product } from "@/features/private/types/products"
import { useDataScope } from "@/hooks/useDataScope"
import { usePagedList } from "@/hooks/usePagedList"
import { fetchCustomers } from "@/store/customersSlice"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import {
  fetchOrders,
  orderAdded,
  orderRemoved,
  orderUpdated,
} from "@/store/ordersSlice"
import { fetchProducts } from "@/store/productsSlice"

const PAGE_SIZE = 8

const NO_ORDERS: Order[] = []
const NO_CUSTOMERS: Customer[] = []
const NO_PRODUCTS: Product[] = []

function nextNumber(orders: Order[]) {
  const highest = orders.reduce(
    (max, order) => Math.max(max, Number(order.number.replace("#", "")) || 0),
    0,
  )

  return `#${highest + 1}`
}

export default function OrdersPage() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()

  const { scope } = useDataScope()

  const storedOrders = useAppSelector((state) => state.orders.byScope[scope])
  const storedCustomers = useAppSelector((state) => state.customers.byScope[scope])
  const storedProducts = useAppSelector((state) => state.products.byScope[scope])
  const status = useAppSelector((state) => state.orders.statusByScope[scope] ?? "idle")

  const orders = storedOrders ?? NO_ORDERS
  const customers = storedCustomers ?? NO_CUSTOMERS
  const products = storedProducts ?? NO_PRODUCTS

  useEffect(() => {
    if (!scope) return

    if (!storedOrders) dispatch(fetchOrders(scope))
    if (!storedCustomers) dispatch(fetchCustomers(scope))
    if (!storedProducts) dispatch(fetchProducts(scope))
  }, [scope, storedOrders, storedCustomers, storedProducts, dispatch])

  const [search, setSearch] = useState("")
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([])
  const [selectedPayments, setSelectedPayments] = useState<string[]>([])

  const [editing, setEditing] = useState<Order | null>(null)
  const [creating, setCreating] = useState(false)
  const [deleting, setDeleting] = useState<Order | null>(null)

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()

    return orders.filter((order) => {
      if (selectedStatuses.length > 0 && !selectedStatuses.includes(order.status)) return false
      if (selectedPayments.length > 0 && !selectedPayments.includes(order.payment)) return false
      if (!term) return true

      return (
        order.number.toLowerCase().includes(term) ||
        order.customerName.toLowerCase().includes(term)
      )
    })
  }, [orders, search, selectedStatuses, selectedPayments])

  const paged = usePagedList(filtered, PAGE_SIZE)

  const revenue = useMemo(
    () => filtered.reduce((sum, order) => sum + order.total, 0),
    [filtered],
  )

  function clearFilters() {
    setSearch("")
    setSelectedStatuses([])
    setSelectedPayments([])
    paged.resetPage()
  }

  function saveOrder(draft: Omit<OrderDraft, "number">, id?: string) {
    if (id) {
      dispatch(orderUpdated({ scope, id, changes: draft }))
      return
    }

    dispatch(
      orderAdded({
        scope,
        item: { ...draft, number: nextNumber(orders), id: crypto.randomUUID() },
      }),
    )
    paged.resetPage()
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{t("orders")}</h1>
          <p className="text-sm text-muted-foreground">
            {t("ordersSubtitle", { count: filtered.length, revenue: revenue.toFixed(2) })}
          </p>
        </div>

        <Button
          onClick={() => setCreating(true)}
          variant="gradient"
        >
          <Plus className="size-4" />
          {t("addOrder")}
        </Button>
      </div>

      <OrdersToolbar
        search={search}
        selectedStatuses={selectedStatuses}
        selectedPayments={selectedPayments}
        onSearchChange={(value) => {
          setSearch(value)
          paged.resetPage()
        }}
        onStatusesChange={(values) => {
          setSelectedStatuses(values)
          paged.resetPage()
        }}
        onPaymentsChange={(values) => {
          setSelectedPayments(values)
          paged.resetPage()
        }}
        onClear={clearFilters}
      />

      <ListCard
        status={status}
        errorText={t("ordersLoadFailed")}
        emptyIcon={ShoppingCart}
        emptyText={t("noOrders")}
        isEmpty={filtered.length === 0}
        paged={paged}
        onRetry={() => dispatch(fetchOrders(scope))}
        onClearFilters={clearFilters}
      >
        <OrdersTable orders={paged.visible} onEdit={setEditing} onDelete={setDeleting} />
      </ListCard>

      {(creating || editing) && (
        <OrderFormDialog
          order={editing}
          customers={customers}
          products={products}
          onSave={saveOrder}
          onClose={() => {
            setCreating(false)
            setEditing(null)
          }}
        />
      )}

      {deleting && (
        <ConfirmDialog
          title={t("deleteOrder")}
          description={t("deleteOrderBody", { number: deleting.number })}
          confirmLabel={t("delete")}
          onConfirm={() => {
            dispatch(orderRemoved({ scope, id: deleting.id }))
            setDeleting(null)
          }}
          onClose={() => setDeleting(null)}
        />
      )}
    </div>
  )
}
