# Dashboard

**Route:** `/dashboard` · **Page:** `src/features/private/pages/DashboardPage.tsx`

The analytics landing page. It is the only private page that does **not** use Redux — the overview payload is fetched into local state and never mutated.

## What the page does

- Four **stat tiles** with trend pills.
- **Visitors donut** and **revenue bar chart** side by side.
- **Top products**, **track progress** and a **sales gauge** in a three-column row.
- A **recent orders** table.
- Every card has a refresh action; failures show a retry button next to the page title.

While loading, each block renders a skeleton of the same height so the layout does not jump.

## Files

| File | Role |
| --- | --- |
| `pages/DashboardPage.tsx` | Fetches the overview, holds loading/error state, lays out the grid. |
| `components/dashboard/SectionCard.tsx` | The shared card: title, optional action, refresh menu. |
| `components/dashboard/StatCard.tsx` | KPI tile and `StatCardSkeleton`. |
| `components/dashboard/VisitorsDonut.tsx` | Donut chart with a centered total. |
| `components/dashboard/RevenueChart.tsx` | Grouped bars for three customer types. |
| `components/dashboard/SalesGauge.tsx` | Half-donut gauge against target. |
| `components/dashboard/TopProducts.tsx` | Product list with prices. |
| `components/dashboard/TrackProgress.tsx` | Per-person progress bars. |
| `components/dashboard/OrdersTable.tsx` | Recent orders (separate from the Orders page table). |
| `types/dashboard.ts` | `Overview` and its parts. |
| `api/overview.ts` | `getOverview()`. |

## Data

One request returns everything:

```ts
type Overview = {
  stats: Stat[]
  visitors: { total: string; segments: Segment[] }
  revenue: { total, change, range, series: RevenuePoint[] }
  products: Product[]
  progress: ProgressItem[]
  sales: { value: number; segments: Segment[] }
  orders: Order[]
}
```

Numeric display values (`total`, `price`, `value`) arrive as **pre-formatted strings** so each language can present them its own way. The `Product` and `Order` types here are dashboard-only shapes — they are not the catalogue `Product` or the sales `Order`.

`getOverview()` validates that `stats` is an array before returning, so a malformed payload fails loudly instead of rendering empty cards.

## Refresh

`reload()` bumps a `reloadKey` that the effect depends on, and the effect guards against setting state after unmount with an `active` flag. Every card receives `onRefresh={reload}`, so the whole payload is re-fetched — there is no per-card endpoint.

## Charts

Recharts, wrapped by `components/ui/chart.tsx`:

- `ChartContainer` forces `dir="ltr"` because Recharts computes its layout left-to-right; without it, Arabic would mirror the axes.
- Series colours come from the theme tokens (`var(--chart-1)` … `var(--chart-5)`), so charts follow light/dark automatically.

## Translations

`analytics`, `welcomeSubtitle`, `websiteVisitors`, `visitors`, `revenueByCustomerType`, `currentClients`, `subscribers`, `newCustomers`, `trackProgress`, `salesActivity`, `ofTarget`, `ordersStatus`, `order`, `client`, `country`, `complete`, `cancelled`, `pending`, `refresh`, `cardOptions`, `overviewLoadFailed`.

## Mock data

`public/mock/{en,ar}/dashboard/overview/{volt,aqua}.json` — the entire payload per company and language.
