import type { Customer } from "@/features/private/types/customers"
import { getSession } from "@/features/public/lib/session"
import { api } from "@/lib/api-client"

export async function getCustomers() {
  const session = getSession()

  if (!session) throw new Error("noSession")

  const { data } = await api.get<Customer[]>(`/customers/${session.company.id}`)

  if (!Array.isArray(data)) throw new Error("invalidCustomersResponse")

  return data
}

export async function getCities() {
  const session = getSession()

  if (!session) throw new Error("noSession")

  const { data } = await api.get<string[]>(`/customers/cities/${session.company.id}`)

  if (!Array.isArray(data)) throw new Error("invalidCitiesResponse")

  return data
}
