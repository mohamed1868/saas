# Orders

**Route:** `/dashboard/orders` · **Page:** `src/features/private/pages/OrdersPage.tsx`

Sales orders for the signed-in company, each holding one or more catalogue products.

## What the page does

- **Subtitle** shows how many orders match the current filters and their combined value.
- **Search** by order number or customer name; **filter** by order status and payment status.
- **Table** — number, customer (avatar + name), date, item count, order status, payment status, total.
- **Form dialog** — pick a customer, set the date and statuses, then add line items; the total updates as you edit.
- **Delete** goes through a confirmation dialog.

Pagination shows 8 rows per page.

## Files

| File | Role |
| --- | --- |
| `pages/OrdersPage.tsx` | Filters, revenue subtitle, dialog state, save/delete. |
| `components/orders/OrdersTable.tsx` | Rows with status and payment badges. |
| `components/orders/OrdersToolbar.tsx` | Search plus two filters. |
| `components/orders/OrderFormDialog.tsx` | Add/edit form with a dynamic item list. |
| `types/orders.ts` | `Order`, `OrderDraft`, `OrderItem`, `ORDER_STATUSES`, `PAYMENT_STATUSES`. |
| `api/orders.ts` | `getOrders()`. |
| `store/ordersSlice.ts` | Scoped slice from `createScopedSlice`. |

## Data model

```ts
type Order = {
  id: string
  number: string        // "#2400"
  customerId: string
  customerName: string
  date: string
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled" | "returned"
  payment: "paid" | "unpaid" | "refunded"
  items: { productId, name, price, quantity }[]
  total: number
}
```

The item snapshot stores the product's name and price at the time of the order, so later catalogue edits do not rewrite history.

## Numbering

`nextNumber()` reads the highest `#####` in the list and adds one, starting from `#1` if the list is empty. Editing an order keeps its number.

## Dependencies on other entities

Customers and products must be loaded for the form's selects, so the page dispatches `fetchCustomers` and `fetchProducts` next to `fetchOrders`.

## Translations

`orders`, `order`, `ordersSubtitle`, `addOrder`, `addOrderSubtitle`, `editOrder`, `editOrderSubtitle`, `deleteOrder`, `deleteOrderBody`, `searchOrders`, `noOrders`, `ordersLoadFailed`, `orderItems`, `addItem`, `items`, `itemsCount`, `payment`, `allPayments`, `orderStatus_*` (6 values), `payment_*` (3 values), plus the shared validation keys `customerRequired`, `productRequired`, `quantityInvalid`, `itemsRequired`, `dateRequired`.

## Mock data

`public/mock/{en,ar}/orders/{volt,aqua}.json` — 22 orders per company, spread across all statuses and payment states.
