export const ORDER_STATUSES = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "returned",
] as const

export const PAYMENT_STATUSES = ["paid", "unpaid", "refunded"] as const

export type OrderStatus = (typeof ORDER_STATUSES)[number]

export type PaymentStatus = (typeof PAYMENT_STATUSES)[number]

export type OrderItem = {
  productId: string
  name: string
  price: number
  quantity: number
}

export type Order = {
  id: string
  number: string
  customerId: string
  customerName: string
  date: string
  status: OrderStatus
  payment: PaymentStatus
  items: OrderItem[]
  total: number
}

export type OrderDraft = Omit<Order, "id">
