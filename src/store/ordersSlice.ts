import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit"

import { getOrders } from "@/features/private/api/orders"
import type { Order } from "@/features/private/types/orders"

type LoadStatus = "idle" | "loading" | "ready" | "failed"

type OrdersState = {
  byScope: Record<string, Order[]>
  statusByScope: Record<string, LoadStatus>
}

const initialState: OrdersState = {
  byScope: {},
  statusByScope: {},
}

export const fetchOrders = createAsyncThunk("orders/fetch", async (scope: string) => {
  const items = await getOrders()
  return { scope, items }
})

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    orderAdded: (state, action: PayloadAction<{ scope: string; order: Order }>) => {
      const { scope, order } = action.payload
      state.byScope[scope] = [order, ...(state.byScope[scope] ?? [])]
    },

    orderUpdated: (
      state,
      action: PayloadAction<{ scope: string; id: string; changes: Partial<Order> }>,
    ) => {
      const { scope, id, changes } = action.payload
      const order = state.byScope[scope]?.find((item) => item.id === id)

      if (order) Object.assign(order, changes)
    },

    orderRemoved: (state, action: PayloadAction<{ scope: string; id: string }>) => {
      const { scope, id } = action.payload
      const items = state.byScope[scope]

      if (items) state.byScope[scope] = items.filter((item) => item.id !== id)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state, action) => {
        state.statusByScope[action.meta.arg] = "loading"
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.byScope[action.payload.scope] = action.payload.items
        state.statusByScope[action.payload.scope] = "ready"
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.statusByScope[action.meta.arg] = "failed"
      })
  },
})

export const { orderAdded, orderUpdated, orderRemoved } = ordersSlice.actions

export default ordersSlice.reducer
