import { getCompanyList } from "@/features/private/api/client"
import type { Order } from "@/features/private/types/orders"

export function getOrders() {
  return getCompanyList<Order>("orders")
}
