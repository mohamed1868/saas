import { getCompanyList } from "@/features/private/api/client"
import type { Product } from "@/features/private/types/products"

export function getProducts() {
  return getCompanyList<Product>("products")
}

export function getCategories() {
  return getCompanyList<string>("products/categories")
}
