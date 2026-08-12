import { PackageSearch, Plus } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"

import { ConfirmDialog } from "@/components/shared/ConfirmDialog"
import { TablePagination } from "@/components/shared/TablePagination"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ProductFormDialog } from "@/features/private/components/products/ProductFormDialog"
import { ProductsTable } from "@/features/private/components/products/ProductsTable"
import { ProductsToolbar } from "@/features/private/components/products/ProductsToolbar"
import { getCategories } from "@/features/private/api/products"
import type { Product, ProductDraft } from "@/features/private/types/products"
import { getSession } from "@/features/public/lib/session"
import { useRemoteList } from "@/hooks/useRemoteList"
import { usePagedList } from "@/hooks/usePagedList"
import { dataScope, mergeOptions } from "@/lib/utils"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import {
  fetchProducts,
  productAdded,
  productRemoved,
  productUpdated,
} from "@/store/productsSlice"

const PAGE_SIZE = 8

const NO_PRODUCTS: Product[] = []

export default function ProductsPage() {
  const { t, i18n } = useTranslation()
  const dispatch = useAppDispatch()

  const companyId = getSession()?.company.id ?? ""
  const scope = companyId ? dataScope(companyId, i18n.language) : ""
  const stored = useAppSelector((state) => state.products.byScope[scope])
  const status = useAppSelector((state) => state.products.statusByScope[scope] ?? "idle")
  const products = stored ?? NO_PRODUCTS
  const remoteCategories = useRemoteList(companyId && `categories:${companyId}`, getCategories)

  useEffect(() => {
    if (scope && !stored) dispatch(fetchProducts(scope))
  }, [scope, stored, dispatch])

  const [search, setSearch] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([])

  const [editing, setEditing] = useState<Product | null>(null)
  const [creating, setCreating] = useState(false)
  const [deleting, setDeleting] = useState<Product | null>(null)

  const categories = useMemo(
    () => mergeOptions(remoteCategories, products.map((product) => product.category)),
    [remoteCategories, products],
  )

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()

    return products.filter((product) => {
      if (selectedCategories.length > 0 && !selectedCategories.includes(product.category))
        return false
      if (selectedStatuses.length > 0 && !selectedStatuses.includes(product.status)) return false
      if (!term) return true

      return (
        product.name.toLowerCase().includes(term) || product.sku.toLowerCase().includes(term)
      )
    })
  }, [products, search, selectedCategories, selectedStatuses])

  const paged = usePagedList(filtered, PAGE_SIZE)

  function clearFilters() {
    setSearch("")
    setSelectedCategories([])
    setSelectedStatuses([])
    paged.resetPage()
  }

  function saveProduct(draft: ProductDraft, id?: string) {
    if (id) {
      dispatch(productUpdated({ scope, id, changes: draft }))
      return
    }

    dispatch(productAdded({ scope, product: { ...draft, id: crypto.randomUUID() } }))
    paged.resetPage()
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

        <Button
          onClick={() => setCreating(true)}
          className="bg-linear-to-r from-primary to-chart-3 text-white hover:brightness-110"
        >
          <Plus className="size-4" />
          {t("addProduct")}
        </Button>
      </div>

      <ProductsToolbar
        search={search}
        categories={categories}
        selectedCategories={selectedCategories}
        selectedStatuses={selectedStatuses}
        onSearchChange={(value) => {
          setSearch(value)
          paged.resetPage()
        }}
        onCategoriesChange={(values) => {
          setSelectedCategories(values)
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
            <p className="text-sm text-destructive">{t("productsLoadFailed")}</p>
            <Button variant="outline" size="sm" onClick={() => dispatch(fetchProducts(scope))}>
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
              <ProductsTable products={paged.visible} onEdit={setEditing} onDelete={setDeleting} />
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
        <ConfirmDialog
          title={t("deleteProduct")}
          description={t("deleteProductBody", { name: deleting.name })}
          confirmLabel={t("delete")}
          onConfirm={() => {
            dispatch(productRemoved({ scope, id: deleting.id }))
            setDeleting(null)
          }}
          onClose={() => setDeleting(null)}
        />
      )}
    </div>
  )
}
