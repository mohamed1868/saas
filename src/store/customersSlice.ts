import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit"

import { getCustomers } from "@/features/private/api/customers"
import type { Customer } from "@/features/private/types/customers"

type LoadStatus = "idle" | "loading" | "ready" | "failed"

type CustomersState = {
  byScope: Record<string, Customer[]>
  statusByScope: Record<string, LoadStatus>
}

const initialState: CustomersState = {
  byScope: {},
  statusByScope: {},
}

export const fetchCustomers = createAsyncThunk("customers/fetch", async (scope: string) => {
  const items = await getCustomers()
  return { scope, items }
})

const customersSlice = createSlice({
  name: "customers",
  initialState,
  reducers: {
    customerAdded: (state, action: PayloadAction<{ scope: string; customer: Customer }>) => {
      const { scope, customer } = action.payload
      state.byScope[scope] = [customer, ...(state.byScope[scope] ?? [])]
    },

    customerUpdated: (
      state,
      action: PayloadAction<{ scope: string; id: string; changes: Partial<Customer> }>,
    ) => {
      const { scope, id, changes } = action.payload
      const customer = state.byScope[scope]?.find((item) => item.id === id)

      if (customer) Object.assign(customer, changes)
    },

    customerRemoved: (state, action: PayloadAction<{ scope: string; id: string }>) => {
      const { scope, id } = action.payload
      const items = state.byScope[scope]

      if (items) state.byScope[scope] = items.filter((item) => item.id !== id)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomers.pending, (state, action) => {
        state.statusByScope[action.meta.arg] = "loading"
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.byScope[action.payload.scope] = action.payload.items
        state.statusByScope[action.payload.scope] = "ready"
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.statusByScope[action.meta.arg] = "failed"
      })
  },
})

export const { customerAdded, customerUpdated, customerRemoved } = customersSlice.actions

export default customersSlice.reducer
