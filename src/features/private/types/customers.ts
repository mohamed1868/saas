export const CUSTOMER_TYPES = ["retail", "wholesale", "vip"] as const

export const CUSTOMER_STATUSES = ["active", "inactive", "blocked"] as const

export type CustomerType = (typeof CUSTOMER_TYPES)[number]

export type CustomerStatus = (typeof CUSTOMER_STATUSES)[number]

export type Customer = {
  id: string
  name: string
  email: string
  phone: string
  city: string
  type: CustomerType
  status: CustomerStatus
  orders: number
  totalSpent: number
}

export type CustomerDraft = Omit<Customer, "id">
