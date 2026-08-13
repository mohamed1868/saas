# Invoices

**Route:** `/dashboard/invoices` · **Page:** `src/features/private/pages/InvoicesPage.tsx`

Billing for the signed-in company: issue invoices from catalogue products, track their status, and print a clean copy.

## What the page does

- **Summary cards** — paid total, outstanding total (sent + overdue) and the count of overdue invoices, computed from the whole list, not the filtered view.
- **Subtitle** — number of invoices currently matching the filters and their combined value.
- **Search** by invoice number or customer name; **filter** by status.
- **Table** — number, customer, issue date, due date, status badge, total, and three row actions: view, edit, delete.
- **Details dialog** — read-only invoice with a status select, a "mark as paid" shortcut, line items, totals, and the print button.
- **Form dialog** — create or edit an invoice; totals recalculate as you type.
- **Delete** goes through a confirmation dialog.

Pagination shows 8 rows per page (`PAGE_SIZE`).

## Files

| File | Role |
| --- | --- |
| `pages/InvoicesPage.tsx` | Filter state, summary maths, dialog state, save/delete handlers. |
| `components/invoices/InvoicesTable.tsx` | Table rows and row actions. |
| `components/invoices/InvoicesToolbar.tsx` | Search input and status filter. |
| `components/invoices/InvoiceFormDialog.tsx` | Add/edit form with live totals. |
| `components/invoices/InvoiceDetailsDialog.tsx` | Read-only view, status change, print trigger. |
| `components/invoices/InvoicePrintSheet.tsx` | The printable sheet. |
| `lib/invoices.ts` | `invoiceTotals()` — the money maths. |
| `types/invoices.ts` | `Invoice`, `InvoiceDraft`, `InvoiceItem`, `INVOICE_STATUSES`. |
| `api/invoices.ts` | `getInvoices()`. |
| `store/invoicesSlice.ts` | Scoped slice built from `createScopedSlice`. |

## Data model

```ts
type Invoice = {
  id: string
  number: string          // "INV-2414"
  customerId: string
  customerName: string
  issueDate: string       // already localized in the mock data
  dueDate: string
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled"
  items: { productId, name, price, quantity }[]
  subtotal: number
  discount: number        // absolute amount, not a percentage
  taxRate: number         // percent
  tax: number
  total: number
}
```

## Totals

`invoiceTotals(items, discount, taxRate)` in `features/private/lib/invoices.ts` is the single place the maths lives — the form preview and the saved record both call it, so what you see is what gets stored.

```
subtotal = Σ (price × quantity)
taxable  = max(subtotal − discount, 0)
tax      = taxable × taxRate / 100
total    = taxable + tax
```

Every value is rounded to two decimals. The discount is clamped so an over-large discount cannot produce negative tax.

## Numbering

`nextNumber()` in the page takes the highest existing `INV-####`, falls back to a floor of `2400`, and adds one. Numbers are only assigned on create; editing never renumbers.

## Dependencies on other entities

The form needs customers and products to populate its selects, so the page dispatches `fetchCustomers` and `fetchProducts` alongside `fetchInvoices`. All three read from the same scope key, so they stay in the same language and company.

## Printing

`InvoicePrintSheet` renders through `createPortal(..., document.body)`, which puts it beside the app root rather than inside the dialog. It is `display: none` on screen; the `@media print` block in `src/index.css` hides `body > *:not(.print-sheet)` and shows the sheet, so `window.print()` produces the invoice alone — no sidebar, no dialog chrome, no buttons.

The sheet is intentionally themeless: fixed neutral colours on white, so it prints the same in light and dark mode.

Inside the items table, numbers sit in `<span dir="ltr">` while the cell keeps the document direction. Putting `dir="ltr"` on the cell itself would flip what `text-end` means and knock the values out of line with their headers in Arabic.

To preview it without printing, emulate print media in a browser devtools rendering panel — the sheet appears in place of the app.

## Translations

Keys live in `public/locales/{en,ar}.json`:

- Labels: `invoices`, `invoice`, `invoicesSubtitle`, `newInvoice`, `editInvoice`, `viewInvoice`, `printInvoice`, `billedTo`, `issueDate`, `dueDate`, `subtotal`, `discount`, `tax`, `taxRate`, `amount`, `quantity`, `markPaid`
- Summary: `paidTotal`, `outstandingTotal`, `overdueInvoices`
- Statuses: `invoiceStatus_draft` · `_sent` · `_paid` · `_overdue` · `_cancelled`
- States and validation: `noInvoices`, `invoicesLoadFailed`, `searchInvoices`, `deleteInvoice`, `deleteInvoiceBody`, `dueDateRequired`, `taxInvalid`, `discountInvalid`
- Print sheet: `invoiceThanks`, `invoiceFooterNote`

## Mock data

`public/mock/{en,ar}/invoices/{volt,aqua}.json` — 14 invoices per company per language, using the same ids, numbers and amounts across languages so only names and dates differ. Statuses cover all five values, and both a 0% and a 14% tax rate appear.
