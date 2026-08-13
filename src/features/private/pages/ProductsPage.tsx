import { PackageSearch, Plus } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"

import { ConfirmDialog } from "@/components/shared/ConfirmDialog"
import { ListCard } from "@/components/shared/ListCard"
import { Button } from "@/components/ui/button"
import { ProductFormDialog } from "@/features/private/components/products/ProductFormDialog"
import { ProductsTable } from "@/features/private/components/products/ProductsTable"
import { ProductsToolbar } from "@/features/private/components/products/ProductsToolbar"
import { getCategories } from "@/features/private/api/products"
import type { Product, ProductDraft } from "@/features/private/types/products"
import { useDataScope } from "@/hooks/useDataScope"
import { useRemoteList } from "@/hooks/useRemoteList"
import { usePagedList } from "@/hooks/usePagedList"
import { mergeOptions } from "@/lib/utils"
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
  const { t } = useTranslation()
  const dispatch = useAppDispatch()

  const { companyId, scope } = useDataScope()
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

    dispatch(productAdded({ scope, item: { ...draft, id: crypto.randomUUID() } }))
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
          variant="gradient"
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

      <ListCard
        status={status}
        errorText={t("productsLoadFailed")}
        emptyIcon={PackageSearch}
        emptyText={t("noProducts")}
        isEmpty={filtered.length === 0}
        paged={paged}
        onRetry={() => dispatch(fetchProducts(scope))}
        onClearFilters={clearFilters}
      >
        <ProductsTable products={paged.visible} onEdit={setEditing} onDelete={setDeleting} />
      </ListCard>

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
