import type { Product } from "@/features/private/types/products"
import { getSession } from "@/features/public/lib/session"
import { api } from "@/lib/api-client"

export async function getProducts() {
  const session = getSession()

  if (!session) throw new Error("noSession")

  const { data } = await api.get<Product[]>(`/products/${session.company.id}`)

  if (!Array.isArray(data)) throw new Error("invalidProductsResponse")

  return data
}

export async function getCategories() {
  const session = getSession()

  if (!session) throw new Error("noSession")

  const { data } = await api.get<string[]>(`/products/categories/${session.company.id}`)

  if (!Array.isArray(data)) throw new Error("invalidCategoriesResponse")

  return data
}
