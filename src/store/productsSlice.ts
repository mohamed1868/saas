import { getProducts } from "@/features/private/api/products"
import type { Product } from "@/features/private/types/products"
import { createScopedSlice } from "@/store/createScopedSlice"

const slice = createScopedSlice<Product>("products", getProducts)

export const fetchProducts = slice.fetchAll
export const productAdded = slice.itemAdded
export const productUpdated = slice.itemUpdated
export const productRemoved = slice.itemRemoved

export default slice.reducer
