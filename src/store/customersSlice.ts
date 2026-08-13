import { getCustomers } from "@/features/private/api/customers"
import type { Customer } from "@/features/private/types/customers"
import { createScopedSlice } from "@/store/createScopedSlice"

const slice = createScopedSlice<Customer>("customers", getCustomers)

export const fetchCustomers = slice.fetchAll
export const customerAdded = slice.itemAdded
export const customerUpdated = slice.itemUpdated
export const customerRemoved = slice.itemRemoved

export default slice.reducer
