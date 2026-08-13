import { getOrders } from "@/features/private/api/orders"
import type { Order } from "@/features/private/types/orders"
import { createScopedSlice } from "@/store/createScopedSlice"

const slice = createScopedSlice<Order>("orders", getOrders)

export const fetchOrders = slice.fetchAll
export const orderAdded = slice.itemAdded
export const orderUpdated = slice.itemUpdated
export const orderRemoved = slice.itemRemoved

export default slice.reducer
