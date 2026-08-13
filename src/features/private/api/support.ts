import { getCompanyList } from "@/features/private/api/client"
import type { Ticket } from "@/features/private/types/support"

export function getTickets() {
  return getCompanyList<Ticket>("support")
}
