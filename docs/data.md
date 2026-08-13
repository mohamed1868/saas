# Data, mocks and translations

Where the app's data comes from and how it stays separated per company and language.

## The scope key

```ts
const { companyId, scope } = useDataScope()   // scope === "volt:ar"
```

`hooks/useDataScope.ts` joins the session's company id with the active language. Every slice stores its records under that key, which gives three things at once: companies never see each other's data, each language keeps its own localized copy, and switching either one triggers a fresh load instead of showing stale rows.

## The HTTP layer

`lib/api-client.ts` creates the Axios instance and installs two interceptors.

**Request:**
- Attaches `Authorization: Bearer <token>` when a token exists.
- Rejects immediately (and ends the session) if a token exists but `getSession()` returns null — a tampered or stale token.
- Sets `Accept-Language` from the stored language.
- In mock mode: forces the method to `GET`, drops the body, and rewrites `/invoices/volt` into `/mock/ar/invoices/volt.json`.

**Response:** any `401` clears the session and redirects to `/login`.

`features/private/api/client.ts` sits on top:

```ts
getCompanyResource<T>(resource)   // GET /{resource}/{companyId}
getCompanyList<T>(resource)       // the same, asserting an array came back
```

So each entity's api file is a one-liner, and the company id is never spelled out at a call site.

## Mock data layout

```
public/mock/
├── en/
│   ├── plans.json                      # not company-scoped
│   ├── products/volt.json  aqua.json
│   ├── products/categories/volt.json  aqua.json
│   ├── customers/volt.json  aqua.json
│   ├── customers/cities/volt.json  aqua.json
│   ├── orders/volt.json  aqua.json
│   ├── invoices/volt.json  aqua.json
│   ├── support/volt.json  aqua.json
│   ├── notifications/volt.json  aqua.json
│   └── dashboard/overview/volt.json  aqua.json
└── ar/   … the same tree
```

Rules that keep the mocks coherent:

- **Ids match across languages.** `inv-volt-001` is the same invoice in `en` and `ar`; only names and dates are translated. Numbers, amounts and statuses stay identical.
- **Ids match across entities.** An invoice's `customerId` exists in that company's customer file, and its `productId`s exist in the product file.
- **Display strings arrive formatted.** Order and invoice dates are pre-formatted per language (`Aug 10, 2026` / `10 أغسطس ٢٠٢٦`), as are the dashboard's numeric strings. Support tickets and notifications are the exception — they carry ISO timestamps and are formatted at render time.

Adding a company means adding `{company}.json` in every folder for both languages, plus an entry in `features/public/data/accounts.ts`. No code changes.

## Local mutations

Creating, editing and deleting only touch the Redux store. `store/index.ts` persists `byScope` to localStorage, so changes survive a refresh but never reach the mock files. Clearing site data restores the originals.

## Translations

- Bundles live at `public/locales/en.json` and `ar.json`, loaded over HTTP by i18next.
- `keySeparator: false`, so keys are flat — `invoiceStatus_paid`, not `invoice.status.paid`.
- Both files must stay key-for-key identical; a missing Arabic key silently falls back to English.
- Interpolation uses double braces: `"invoicesSubtitle": "{{count}} invoices · ${{billed}} billed"`.
- Status keys follow `<entity>Status_<value>` so components can build them from data: `` t(`invoiceStatus_${invoice.status}`) ``.

### Direction

`lib/i18n.ts` sets `<html lang dir>` before React mounts. Everything else follows from logical CSS utilities — `ms-`/`me-`, `ps-`/`pe-`, `text-start`/`text-end`, `start-`/`end-` — so no component branches on language for layout.

Two things stay LTR on purpose: money and other numbers (wrapped in `dir="ltr"`), and Recharts containers. When you need an LTR number inside an RTL block, put `dir="ltr"` on the innermost element that holds the number — putting it on a table cell also flips what `text-end` means and misaligns the column.

Changing language calls `window.location.reload()` — the simplest way to reset direction, re-request the right mock files and drop any language-specific caches.
