import { getCompanyList } from "@/features/private/api/client"
import type { Customer } from "@/features/private/types/customers"

export function getCustomers() {
  return getCompanyList<Customer>("customers")
}

export function getCities() {
  return getCompanyList<string>("customers/cities")
}
