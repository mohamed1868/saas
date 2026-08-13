# Products

**Route:** `/dashboard/products` · **Page:** `src/features/private/pages/ProductsPage.tsx`

The company's catalogue — what orders and invoices draw their line items from.

## What the page does

- **Subtitle** shows the total number of products in the catalogue.
- **Search** by name or SKU; **filter** by category and status.
- **Table** — name with SKU and a letter tile, category, price, stock, status. Stock turns amber under 10 units and red at zero, where an "out of stock" label also appears.
- **Form dialog** — add or edit a product.
- **Delete** goes through a confirmation dialog.

Pagination shows 8 rows per page.

## Files

| File | Role |
| --- | --- |
| `pages/ProductsPage.tsx` | Filters, category merge, dialog state, save/delete. |
| `components/products/ProductsTable.tsx` | Rows with stock warnings and status badge. |
| `components/products/ProductsToolbar.tsx` | Search plus category and status filters. |
| `components/products/ProductFormDialog.tsx` | Add/edit form. |
| `types/products.ts` | `Product`, `ProductDraft`, `PRODUCT_STATUSES`. |
| `api/products.ts` | `getProducts()`, `getCategories()`. |
| `store/productsSlice.ts` | Scoped slice from `createScopedSlice`. |

## Data model

```ts
type Product = {
  id: string
  name: string
  sku: string
  category: string
  price: number
  stock: number
  status: "active" | "draft" | "archived"
}
```

## Categories

Categories come from two places and are merged by `mergeOptions()`:

1. `getCategories()` — the server's list, loaded once per company through `useRemoteList`.
2. The categories actually present in the loaded products.

That way a product created locally with a new category still appears in the filter and the form select. Note that `useRemoteList` keys its cache by company only; this is safe because switching language reloads the page.

## Validation

Zod rules built in `buildSchema(t)`: name ≥ 2 characters, SKU ≥ 3 (upper-cased on save), category required, price matches `^\d+(\.\d{1,2})?$`, stock is a whole number. The submit button stays disabled until the form is valid.

## Translations

`products`, `product`, `productsSubtitle`, `addProduct`, `addProductSubtitle`, `editProduct`, `editProductSubtitle`, `deleteProduct`, `deleteProductBody`, `productName`, `sku`, `category`, `price`, `stock`, `outOfStock`, `searchProducts`, `allCategories`, `noProducts`, `productsLoadFailed`, `status_active` · `status_draft` · `status_archived`, plus `skuRequired`, `categoryRequired`, `priceInvalid`, `stockInvalid`.

## Mock data

- `public/mock/{en,ar}/products/{volt,aqua}.json` — 24 products per company.
- `public/mock/{en,ar}/products/categories/{volt,aqua}.json` — the category options.
