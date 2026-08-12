import type { Order } from "@/features/private/types/orders"
import { getSession } from "@/features/public/lib/session"
import { api } from "@/lib/api-client"

export async function getOrders() {
  const session = getSession()

  if (!session) throw new Error("noSession")

  const { data } = await api.get<Order[]>(`/orders/${session.company.id}`)

  if (!Array.isArray(data)) throw new Error("invalidOrdersResponse")

  return data
}
