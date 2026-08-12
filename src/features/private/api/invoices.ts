import type { Invoice } from "@/features/private/types/invoices"
import { getSession } from "@/features/public/lib/session"
import { api } from "@/lib/api-client"

export async function getInvoices() {
  const session = getSession()

  if (!session) throw new Error("noSession")

  const { data } = await api.get<Invoice[]>(`/invoices/${session.company.id}`)

  if (!Array.isArray(data)) throw new Error("invalidInvoicesResponse")

  return data
}
