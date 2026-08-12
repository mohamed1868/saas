import { getSession } from "@/features/public/login/lib/session"
import type { Product } from "@/features/private/products/types/products"
import { api } from "@/lib/api-client"

export async function getProducts() {
  const session = getSession()

  if (!session) throw new Error("noSession")

  const { data } = await api.get<Product[]>(`/products/${session.company.id}`)

  if (!Array.isArray(data)) throw new Error("invalidProductsResponse")

  return data
}
