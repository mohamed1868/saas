import { getCompanyList } from "@/features/private/api/client"
import type { Invoice } from "@/features/private/types/invoices"

export function getInvoices() {
  return getCompanyList<Invoice>("invoices")
}
