import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit"

import { getInvoices } from "@/features/private/api/invoices"
import type { Invoice } from "@/features/private/types/invoices"

type LoadStatus = "idle" | "loading" | "ready" | "failed"

type InvoicesState = {
  byScope: Record<string, Invoice[]>
  statusByScope: Record<string, LoadStatus>
}

const initialState: InvoicesState = {
  byScope: {},
  statusByScope: {},
}

export const fetchInvoices = createAsyncThunk("invoices/fetch", async (scope: string) => {
  const items = await getInvoices()
  return { scope, items }
})

const invoicesSlice = createSlice({
  name: "invoices",
  initialState,
  reducers: {
    invoiceAdded: (state, action: PayloadAction<{ scope: string; invoice: Invoice }>) => {
      const { scope, invoice } = action.payload
      state.byScope[scope] = [invoice, ...(state.byScope[scope] ?? [])]
    },

    invoiceUpdated: (
      state,
      action: PayloadAction<{ scope: string; id: string; changes: Partial<Invoice> }>,
    ) => {
      const { scope, id, changes } = action.payload
      const invoice = state.byScope[scope]?.find((item) => item.id === id)

      if (invoice) Object.assign(invoice, changes)
    },

    invoiceRemoved: (state, action: PayloadAction<{ scope: string; id: string }>) => {
      const { scope, id } = action.payload
      const items = state.byScope[scope]

      if (items) state.byScope[scope] = items.filter((item) => item.id !== id)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInvoices.pending, (state, action) => {
        state.statusByScope[action.meta.arg] = "loading"
      })
      .addCase(fetchInvoices.fulfilled, (state, action) => {
        state.byScope[action.payload.scope] = action.payload.items
        state.statusByScope[action.payload.scope] = "ready"
      })
      .addCase(fetchInvoices.rejected, (state, action) => {
        state.statusByScope[action.meta.arg] = "failed"
      })
  },
})

export const { invoiceAdded, invoiceUpdated, invoiceRemoved } = invoicesSlice.actions

export default invoicesSlice.reducer
