# FluxSync

A bilingual (English / Arabic) multi-company business dashboard built with React, TypeScript and Vite.
Each company signs in and sees its own products, customers, orders, invoices, support tickets and analytics — fully localized, with light/dark themes and RTL support.

> Detailed documentation lives in [docs/](docs/README.md) — one document per page, plus architecture, shared components, data and configuration.

## Features

- **Multi-company sessions** — two demo companies, each with its own data set and subscription plan.
- **Products** — catalogue with categories, stock levels, statuses, search and filters.
- **Customers** — customer book with types, cities, spending and statuses.
- **Orders** — multi-item orders with order/payment statuses and live totals.
- **Invoices** — issue/due dates, line items, discount and tax, status workflow, and a print-ready invoice sheet.
- **Support** — ticket threads with priorities, categories and replies, plus direct contact channels.
- **Dashboard** — stats, revenue chart, visitors donut, sales gauge, top products and recent orders.
- **Notifications** — typed feed with read/unread state.
- **Account** — profile, subscription countdown and preferences.
- **i18n + RTL** — every string is translated; direction, layout and icons flip with the language.
- **Themes** — light and dark, persisted per device.

## Tech stack

| Area | Choice |
| --- | --- |
| Build | Vite 8 |
| UI | React 19, TypeScript, Tailwind CSS v4, shadcn/ui (Radix) |
| State | Redux Toolkit + redux-persist (localStorage) |
| Routing | React Router 7 (lazy routes, protected layout) |
| Forms | React Hook Form + Zod |
| Charts | Recharts |
| HTTP | Axios |
| i18n | i18next + i18next-http-backend |

## Getting started

```bash
npm install
cp .env.example .env
npm run dev
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Type-check (`tsc -b`) then build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint |

### Environment

```ini
VITE_USE_MOCKS=true                 # read data from /public/mock instead of a real API
VITE_API_URL=http://localhost:8000/api   # used when VITE_USE_MOCKS is false
```

`.env` is git-ignored, so a deployment never sees it. To keep the demo working anywhere, the app falls back to mock mode whenever `VITE_API_URL` is missing — point it at a real API (in the host's environment settings) to switch off the mocks.

The plan request form posts to Web3Forms with an access key hard-coded in `features/public/api/planRequest.ts`. Web3Forms access keys are public by design — they ship in the client bundle either way — so the form works on any deployment with no configuration. Rotate the key in the Web3Forms dashboard if the form starts collecting spam.

### Demo accounts

| Username | Password | Company |
| --- | --- | --- |
| `volt` | `Volt2026` | Volt Home Appliances |
| `aqua` | `Aqua2026` | AquaCare Sanitary |

## Project structure

```
src/
├── app/              App shell, providers and router
├── assets/           Logos
├── components/
│   ├── errors/       Error and 404 pages
│   ├── layouts/      Sidebar, header, main layout, user menu
│   ├── shared/       Reusable pieces (ListCard, StatusBadge, filters, pagination…)
│   └── ui/           shadcn/ui primitives
├── config/           Site-wide constants (brand, support channels)
├── features/
│   ├── private/      Everything behind the login (api, components, pages, types)
│   └── public/       Login and plans (api, components, pages, types, session)
├── hooks/            useDataScope, usePagedList, useRemoteList, use-mobile
├── lib/              Axios client, i18n setup, helpers
└── store/            Redux slices and the scoped-slice factory
public/
├── locales/          en.json / ar.json translation bundles
└── mock/{lang}/…     Mock API responses per language and company
```

## How data flows

1. A page asks for its slice of state through `useDataScope()`, which builds a **scope key** of `companyId:language` (e.g. `volt:ar`).
2. If that scope has no data yet, the page dispatches the slice's `fetch` thunk.
3. The thunk calls a function in `features/private/api/*`, which goes through `getCompanyList()` → Axios.
4. In mock mode the Axios interceptor rewrites `/invoices/volt` into `/mock/ar/invoices/volt.json`, so switching language or company loads a different data set.
5. Results are stored under `byScope[scope]` and persisted to localStorage, so edits survive a refresh.

Because every entity is keyed by scope, two companies never see each other's data and each language keeps its own localized copy.

## Adding a new entity

The list pages share one skeleton (see [docs/architecture.md](docs/architecture.md)), so a new entity takes a handful of small files:

1. `features/private/types/<entity>.ts` — the item type plus its status constants.
2. `features/private/api/<entity>.ts` — one line: `getCompanyList<Item>("<entity>")`.
3. `store/<entity>Slice.ts` — `createScopedSlice<Item>("<entity>", getItems)` and re-export the actions.
4. Register the reducer in `store/index.ts` (wrapped in `persistReducer`).
5. `features/private/components/<entity>/` — table, toolbar and form dialog.
6. `features/private/pages/<Entity>Page.tsx` — filters + `<ListCard>` + dialogs.
7. Wire it up: `app/router/paths.ts`, `lazyRoutes.ts`, `router/index.tsx`, and the `NAV` array in `AppSidebar.tsx`.
8. Add the translation keys to both `public/locales/en.json` and `ar.json`, and mock JSON under `public/mock/{en,ar}/<entity>/{volt,aqua}.json`.

## Deployment

`vercel.json` rewrites every path to `index.html` so client-side routing works on Vercel. Any static host works the same way — build with `npm run build` and serve `dist/` with an SPA fallback.
