import type { Product, ProductStatus } from "@/features/private/products/types/products"

export const ALL_FILTER = "all"

export const PAGE_SIZE = 8

export const LOW_STOCK = 10

export const STATUS_STYLES: Record<ProductStatus, string> = {
  active: "bg-chart-4/15 text-chart-4",
  draft: "bg-chart-5/15 text-chart-5",
  archived: "bg-muted text-muted-foreground",
}

export function formatPrice(value: number) {
  return `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export function categoriesOf(products: Product[]) {
  return [...new Set(products.map((product) => product.category))].sort((a, b) =>
    a.localeCompare(b),
  )
}
