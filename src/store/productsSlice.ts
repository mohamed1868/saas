import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit"

import { getProducts } from "@/features/private/products/api/products"
import type { Product, ProductDraft } from "@/features/private/products/types/products"

type LoadStatus = "idle" | "loading" | "ready" | "failed"

type ProductsState = {
  byCompany: Record<string, Product[]>
  statusByCompany: Record<string, LoadStatus>
}

const initialState: ProductsState = {
  byCompany: {},
  statusByCompany: {},
}

export const fetchProducts = createAsyncThunk("products/fetch", async (companyId: string) => {
  const items = await getProducts()
  return { companyId, items }
})

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    productAdded: (state, action: PayloadAction<{ companyId: string; product: Product }>) => {
      const { companyId, product } = action.payload
      state.byCompany[companyId] = [product, ...(state.byCompany[companyId] ?? [])]
    },

    productUpdated: (
      state,
      action: PayloadAction<{ companyId: string; id: string; draft: ProductDraft }>,
    ) => {
      const { companyId, id, draft } = action.payload
      const items = state.byCompany[companyId]
      if (!items) return

      const index = items.findIndex((item) => item.id === id)
      if (index !== -1) items[index] = { ...items[index], ...draft }
    },

    productRemoved: (state, action: PayloadAction<{ companyId: string; id: string }>) => {
      const { companyId, id } = action.payload
      const items = state.byCompany[companyId]
      if (!items) return

      state.byCompany[companyId] = items.filter((item) => item.id !== id)
    },

    productsReset: (state, action: PayloadAction<{ companyId: string }>) => {
      delete state.byCompany[action.payload.companyId]
      delete state.statusByCompany[action.payload.companyId]
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state, action) => {
        state.statusByCompany[action.meta.arg] = "loading"
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.byCompany[action.payload.companyId] = action.payload.items
        state.statusByCompany[action.payload.companyId] = "ready"
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.statusByCompany[action.meta.arg] = "failed"
      })
  },
})

export const { productAdded, productUpdated, productRemoved, productsReset } =
  productsSlice.actions

export default productsSlice.reducer
