import type { Customer } from "@/features/private/customers/types/customers"
import { getSession } from "@/features/public/login/lib/session"
import { api } from "@/lib/api-client"

export async function getCustomers() {
  const session = getSession()

  if (!session) throw new Error("noSession")

  const { data } = await api.get<Customer[]>(`/customers/${session.company.id}`)

  if (!Array.isArray(data)) throw new Error("invalidCustomersResponse")

  return data
}
