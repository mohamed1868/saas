export type Stat = {
  id: string
  label: string
  value: string
  change: number
}

export type Segment = {
  id: string
  label: string
  value: number
}

export type RevenuePoint = {
  month: string
  current: number
  subscribers: number
  newCustomers: number
}

export type Revenue = {
  total: string
  change: number
  range: string
  series: RevenuePoint[]
}

export type Product = {
  id: string
  name: string
  category: string
  price: string
}

export type ProgressItem = {
  id: string
  name: string
  email: string
  value: number
}

export type OrderStatus = "complete" | "cancelled" | "pending"

export type Order = {
  id: string
  client: { name: string; email: string }
  date: string
  status: OrderStatus
  country: string
  total: string
}

export type Overview = {
  stats: Stat[]
  visitors: { total: string; segments: Segment[] }
  revenue: Revenue
  products: Product[]
  progress: ProgressItem[]
  sales: { value: number; segments: Segment[] }
  orders: Order[]
}
