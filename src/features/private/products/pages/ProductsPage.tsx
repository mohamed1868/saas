import { PackageSearch, Plus, RotateCcw } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { DeleteProductDialog } from "@/features/private/products/components/DeleteProductDialog"
import { ProductFormDialog } from "@/features/private/products/components/ProductFormDialog"
import { ProductsPagination } from "@/features/private/products/components/ProductsPagination"
import { ProductsTable } from "@/features/private/products/components/ProductsTable"
import { ProductsToolbar } from "@/features/private/products/components/ProductsToolbar"
import { ALL_FILTER, PAGE_SIZE, categoriesOf } from "@/features/private/products/lib/products"
import type { Product, ProductDraft } from "@/features/private/products/types/products"
import { getSession } from "@/features/public/login/lib/session"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import {
  fetchProducts,
  productAdded,
  productRemoved,
  productUpdated,
  productsReset,
} from "@/store/productsSlice"

export default function ProductsPage() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()

  const companyId = getSession()?.company.id ?? ""
  const companyProducts = useAppSelector((state) => state.products.byCompany[companyId])
  const status = useAppSelector((state) => state.products.statusByCompany[companyId] ?? "idle")

  const [search, setSearch] = useState("")
  const [category, setCategory] = useState(ALL_FILTER)
  const [statusFilter, setStatusFilter] = useState(ALL_FILTER)
  const [page, setPage] = useState(1)

  const [editing, setEditing] = useState<Product | null>(null)
  const [creating, setCreating] = useState(false)
  const [deleting, setDeleting] = useState<Product | null>(null)

  useEffect(() => {
    if (companyId && !companyProducts && status !== "loading" && status !== "failed") {
      dispatch(fetchProducts(companyId))
    }
  }, [companyId, companyProducts, status, dispatch])

  const products = useMemo(() => companyProducts ?? [], [companyProducts])
  const categories = useMemo(() => categoriesOf(products), [products])

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()

    return products.filter((product) => {
      if (category !== ALL_FILTER && product.category !== category) return false
      if (statusFilter !== ALL_FILTER && product.status !== statusFilter) return false
      if (!term) return true

      return (
        product.name.toLowerCase().includes(term) || product.sku.toLowerCase().includes(term)
      )
    })
  }, [products, search, category, statusFilter])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const start = (currentPage - 1) * PAGE_SIZE
  const visible = filtered.slice(start, start + PAGE_SIZE)

  const loading = !companyProducts && status === "loading"
  const failed = !companyProducts && status === "failed"

  function resetPage() {
    setPage(1)
  }

  function clearFilters() {
    setSearch("")
    setCategory(ALL_FILTER)
    setStatusFilter(ALL_FILTER)
    resetPage()
  }

  function saveProduct(draft: ProductDraft, id?: string) {
    if (id) {
      dispatch(productUpdated({ companyId, id, draft }))
      return
    }

    dispatch(productAdded({ companyId, product: { ...draft, id: crypto.randomUUID() } }))
    resetPage()
  }

  function restoreData() {
    dispatch(productsReset({ companyId }))
    dispatch(fetchProducts(companyId))
    clearFilters()
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{t("products")}</h1>
          <p className="text-sm text-muted-foreground">
            {t("productsSubtitle", { count: products.length })}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={restoreData}>
            <RotateCcw className="size-4" />
            {t("restoreData")}
          </Button>

          <Button
            onClick={() => setCreating(true)}
            className="bg-linear-to-r from-primary to-chart-3 text-white hover:brightness-110"
          >
            <Plus className="size-4" />
            {t("addProduct")}
          </Button>
        </div>
      </div>

      <ProductsToolbar
        search={search}
        category={category}
        status={statusFilter}
        categories={categories}
        onSearchChange={(value) => {
          setSearch(value)
          resetPage()
        }}
        onCategoryChange={(value) => {
          setCategory(value)
          resetPage()
        }}
        onStatusChange={(value) => {
          setStatusFilter(value)
          resetPage()
        }}
        onClear={clearFilters}
      />

      <Card className="overflow-hidden rounded-xl border-border/70">
        {loading ? (
          <div className="space-y-3 p-5">
            {Array.from({ length: 6 }, (_, index) => (
              <Skeleton key={index} className="h-12 w-full" />
            ))}
          </div>
        ) : failed ? (
          <div className="flex flex-col items-center gap-3 p-10">
            <p className="text-sm text-destructive">{t("productsLoadFailed")}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => dispatch(fetchProducts(companyId))}
            >
              {t("retry")}
            </Button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-3 p-12 text-center">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
              <PackageSearch className="size-6" />
            </span>
            <p className="text-sm text-muted-foreground">{t("noProducts")}</p>
            <Button variant="outline" size="sm" onClick={clearFilters}>
              {t("clearFilters")}
            </Button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <ProductsTable products={visible} onEdit={setEditing} onDelete={setDeleting} />
            </div>

            <ProductsPagination
              page={currentPage}
              pageCount={pageCount}
              from={start + 1}
              to={start + visible.length}
              total={filtered.length}
              onPageChange={setPage}
            />
          </>
        )}
      </Card>

      {(creating || editing) && (
        <ProductFormDialog
          product={editing}
          categories={categories}
          onSave={saveProduct}
          onClose={() => {
            setCreating(false)
            setEditing(null)
          }}
        />
      )}

      {deleting && (
        <DeleteProductDialog
          product={deleting}
          onConfirm={() => {
            dispatch(productRemoved({ companyId, id: deleting.id }))
            setDeleting(null)
          }}
          onClose={() => setDeleting(null)}
        />
      )}
    </div>
  )
}
