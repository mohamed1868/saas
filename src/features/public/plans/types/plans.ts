export type Plan = {
  id: string
  name: string
  description: string
  price: string
  features: string[]
  featured?: boolean
}

export type PlanRequest = {
  company: string
  name: string
  email: string
  phone: string
  planId: string
  message?: string
}
