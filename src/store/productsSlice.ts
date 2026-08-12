import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit"

import { getProducts } from "@/features/private/api/products"
import type { Product } from "@/features/private/types/products"

type LoadStatus = "idle" | "loading" | "ready" | "failed"

type ProductsState = {
  byScope: Record<string, Product[]>
  statusByScope: Record<string, LoadStatus>
}

const initialState: ProductsState = {
  byScope: {},
  statusByScope: {},
}

export const fetchProducts = createAsyncThunk("products/fetch", async (scope: string) => {
  const items = await getProducts()
  return { scope, items }
})

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    productAdded: (state, action: PayloadAction<{ scope: string; product: Product }>) => {
      const { scope, product } = action.payload
      state.byScope[scope] = [product, ...(state.byScope[scope] ?? [])]
    },

    productUpdated: (
      state,
      action: PayloadAction<{ scope: string; id: string; changes: Partial<Product> }>,
    ) => {
      const { scope, id, changes } = action.payload
      const product = state.byScope[scope]?.find((item) => item.id === id)

      if (product) Object.assign(product, changes)
    },

    productRemoved: (state, action: PayloadAction<{ scope: string; id: string }>) => {
      const { scope, id } = action.payload
      const items = state.byScope[scope]

      if (items) state.byScope[scope] = items.filter((item) => item.id !== id)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state, action) => {
        state.statusByScope[action.meta.arg] = "loading"
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.byScope[action.payload.scope] = action.payload.items
        state.statusByScope[action.payload.scope] = "ready"
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.statusByScope[action.meta.arg] = "failed"
      })
  },
})

export const { productAdded, productUpdated, productRemoved } = productsSlice.actions

export default productsSlice.reducer
