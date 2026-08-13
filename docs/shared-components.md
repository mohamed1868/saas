# Layouts, shared components and UI kit

Everything under `src/components`. Feature-specific components live with their page — see the page documents.

## Layouts — `components/layouts`

| Component | What it does |
| --- | --- |
| `MainLayout` | The authenticated shell: `SidebarProvider` → `AppSidebar` + `SidebarInset` (`Header` + `<Outlet />`). Rendered once; pages swap inside it. |
| `AppSidebar` | Navigation from the `NAV` array, logo (light/dark variants), and a footer card with the company, plan and days remaining. Sits on the right in Arabic via `side={rtl ? "right" : "left"}`. Entries without a `to` render disabled with a "Soon" badge. |
| `Header` | Sidebar trigger, language select, theme toggle. |
| `NavUser` | User dropdown in the sidebar footer: profile summary, links to account and notifications (with the unread count), logout. |

Adding a menu entry means adding one object to `NAV` — `{ key, icon, to }` — where `key` is also the translation key.

## Shared components — `components/shared`

| Component | Props worth knowing | Used by |
| --- | --- | --- |
| `ListCard` | `status`, `errorText`, `emptyIcon`, `emptyText`, `isEmpty`, `paged`, `onRetry`, `onClearFilters` | Every list page |
| `StatusBadge` | `tone` (a colour class), children | All five tables |
| `ConfirmDialog` | `title`, `description`, `confirmLabel`, `onConfirm`, `onClose` | Every delete flow |
| `SearchInput` | `value`, `placeholder`, `onChange` | Every toolbar |
| `MultiSelectFilter` | `placeholder`, `options`, `selected`, `onChange` | Every toolbar |
| `TablePagination` | `page`, `pageCount`, `from`, `to`, `total`, `onPageChange` | Inside `ListCard` |
| `LanguageSelect` | — | Header, login, plans, account |
| `ModeToggle` | — | Header, login, plans, account |
| `PageFallback` | — | `Suspense` and `PersistGate` |

### ListCard

The four states of a list page, in one place:

1. `status === "loading"` → six skeleton rows.
2. `status === "failed"` → the error text and a retry button.
3. `isEmpty` → the empty icon, message and a clear-filters button.
4. otherwise → the table (as children) inside a horizontal scroll container, followed by `TablePagination`.

It takes `paged` — the object returned by `usePagedList` — and renders the pagination itself, so pages never wire those six props by hand.

### StatusBadge

The pill shape lives here; each table keeps its own colour map:

```tsx
const STATUS_STYLES: Record<InvoiceStatus, string> = {
  paid: "bg-chart-4/15 text-chart-4",
  overdue: "bg-destructive/15 text-destructive",
  ...
}

<StatusBadge tone={STATUS_STYLES[invoice.status]}>{t(`invoiceStatus_${invoice.status}`)}</StatusBadge>
```

### MultiSelectFilter

Summarises the selection as the first label plus `+N`, keeps the menu open while toggling (`onSelect` prevents default), and appends a clear item once anything is selected.

### TablePagination

Renders one button per page. Fine at the current data sizes; a windowed range would be needed for hundreds of pages.

## UI kit — `components/ui`

shadcn/ui primitives, mostly untouched. Regenerate them with the settings in `components.json`.

`button.tsx` carries one project addition — a `gradient` variant for primary actions:

```tsx
<Button variant="gradient">{t("newInvoice")}</Button>
```

`chart.tsx` is the only other customised file: `ChartContainer` locks charts to `dir="ltr"` and styles Recharts' internals through the theme tokens.

The ESLint config relaxes `react-refresh/only-export-components` and two React Hooks rules for this folder, since the upstream files export helpers next to components.

## Theme — `components/theme-provider.tsx`

Holds the theme in state, writes it to localStorage, and toggles the `dark` class on `<html>`. `useTheme()` is exported alongside the provider, which the ESLint config explicitly allows.
