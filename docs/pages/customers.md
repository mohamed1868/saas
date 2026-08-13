# Customers

**Route:** `/dashboard/customers` · **Page:** `src/features/private/pages/CustomersPage.tsx`

The company's customer book — the source of the customer select in orders and invoices.

## What the page does

- **Subtitle** shows the total number of customers.
- **Search** by name, email or phone; **filter** by city, type and status.
- **Table** — avatar with name and email, phone, city, type badge, order count, total spent, status badge.
- **Form dialog** — add or edit a customer.
- **Delete** goes through a confirmation dialog.

Pagination shows 8 rows per page.

## Files

| File | Role |
| --- | --- |
| `pages/CustomersPage.tsx` | Filters, city merge, dialog state, save/delete. |
| `components/customers/CustomersTable.tsx` | Rows with type and status badges. |
| `components/customers/CustomersToolbar.tsx` | Search plus three filters. |
| `components/customers/CustomerFormDialog.tsx` | Add/edit form. |
| `types/customers.ts` | `Customer`, `CustomerDraft`, `CUSTOMER_TYPES`, `CUSTOMER_STATUSES`. |
| `api/customers.ts` | `getCustomers()`, `getCities()`. |
| `store/customersSlice.ts` | Scoped slice from `createScopedSlice`. |

## Data model

```ts
type Customer = {
  id: string
  name: string
  email: string
  phone: string
  city: string
  type: "retail" | "wholesale" | "vip"
  status: "active" | "inactive" | "blocked"
  orders: number
  totalSpent: number
}
```

`orders` and `totalSpent` are read-only statistics — the form preserves the existing values when editing and starts both at `0` for a new customer. They are not recomputed from the orders page.

## Cities

Same pattern as product categories: `getCities()` supplies the server list, `mergeOptions()` folds in any city already present in the loaded customers, and the merged list feeds both the filter and the form select.

## Validation

Name ≥ 2 characters, a valid email, phone matching `^[+0-9\s()-]{8,20}$`, city required, type and status from their constants.

## Translations

`customers`, `customer`, `customersSubtitle`, `addCustomer`, `addCustomerSubtitle`, `editCustomer`, `editCustomerSubtitle`, `deleteCustomer`, `deleteCustomerBody`, `customerName`, `customerType`, `city`, `totalSpent`, `searchCustomers`, `allCities`, `allTypes`, `noCustomers`, `customersLoadFailed`, `cityRequired`, `customerType_*` (3), `customerStatus_*` (3).

## Mock data

- `public/mock/{en,ar}/customers/{volt,aqua}.json` — 26 customers per company.
- `public/mock/{en,ar}/customers/cities/{volt,aqua}.json` — the city options.
