export const PRODUCT_STATUSES = ["active", "draft", "archived"] as const

export type ProductStatus = (typeof PRODUCT_STATUSES)[number]

export type Product = {
  id: string
  name: string
  sku: string
  category: string
  price: number
  stock: number
  status: ProductStatus
}

export type ProductDraft = Omit<Product, "id">
