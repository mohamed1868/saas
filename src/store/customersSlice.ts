import { getCustomers } from "@/features/private/customers/api/customers"
import type { Customer } from "@/features/private/customers/types/customers"
import { createRecordsSlice } from "@/store/createRecordsSlice"

export const customers = createRecordsSlice<Customer>("customers", getCustomers)

export default customers.reducer
