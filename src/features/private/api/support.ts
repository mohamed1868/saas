import type { Ticket } from "@/features/private/types/support"
import { getSession } from "@/features/public/lib/session"
import { api } from "@/lib/api-client"

export async function getTickets() {
  const session = getSession()

  if (!session) throw new Error("noSession")

  const { data } = await api.get<Ticket[]>(`/support/${session.company.id}`)

  if (!Array.isArray(data)) throw new Error("invalidTicketsResponse")

  return data
}
