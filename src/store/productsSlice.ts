import { getProducts } from "@/features/private/products/api/products"
import type { Product } from "@/features/private/products/types/products"
import { createRecordsSlice } from "@/store/createRecordsSlice"

export const products = createRecordsSlice<Product>("products", getProducts)

export default products.reducer
