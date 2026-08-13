import { getInvoices } from "@/features/private/api/invoices"
import type { Invoice } from "@/features/private/types/invoices"
import { createScopedSlice } from "@/store/createScopedSlice"

const slice = createScopedSlice<Invoice>("invoices", getInvoices)

export const fetchInvoices = slice.fetchAll
export const invoiceAdded = slice.itemAdded
export const invoiceUpdated = slice.itemUpdated
export const invoiceRemoved = slice.itemRemoved

export default slice.reducer
