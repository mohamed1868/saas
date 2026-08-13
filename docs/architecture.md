# Architecture

How the app boots, routes, authenticates and stores data.

## Boot sequence

| Step | File | What happens |
| --- | --- | --- |
| 1 | `index.html` | Loads `/src/main.tsx` into `#root`. |
| 2 | `src/main.tsx` | Imports `index.css` and `lib/i18n` (which sets `<html lang dir>` before React renders), then mounts `<App />`. |
| 3 | `src/app/App.tsx` | Wraps the router in `AppProvider`. |
| 4 | `src/app/provider.tsx` | Redux `Provider` → `PersistGate` (shows `PageFallback` while localStorage rehydrates) → `ThemeProvider`. |
| 5 | `src/app/router/index.tsx` | Renders the matched route inside `Suspense`. |

## Routing

- **`app/router/paths.ts`** — every URL in one object. Import `PATHS` instead of writing string literals.
- **`app/router/lazyRoutes.ts`** — `React.lazy` wrappers so each page is its own bundle chunk.
- **`app/router/index.tsx`** — the route tree:
  - Public: `/login`, `/plans`
  - `ProtectedRoute` → `MainLayout` → `/dashboard`, `/dashboard/products`, `/dashboard/customers`, `/dashboard/orders`, `/dashboard/invoices`, `/dashboard/support`, `/dashboard/account`, `/dashboard/notifications`
  - `/` redirects to `/dashboard`; `*` renders the 404 page; `errorElement` catches render errors.
- **`app/router/ProtectedRoute.tsx`** — sends visitors without a valid session to `/login`.

Adding a route means touching three files: `paths.ts`, `lazyRoutes.ts`, `index.tsx` — plus the `NAV` array in `AppSidebar.tsx` if it should appear in the menu.

## Sessions

`features/public/lib/session.ts` owns everything auth-related. There is no backend, so a session is a token plus a user object in localStorage.

| Export | Purpose |
| --- | --- |
| `saveSession(token, user)` | Called after a successful sign-in. |
| `getSession()` | Returns the user, or `null`. Re-checks the token against `data/accounts.ts` and verifies the plan has not expired; clears everything if either check fails. |
| `clearSession()` | Logout, and the 401 handler in `api-client.ts`. |
| `isPlanActive(plan)` / `daysLeft(plan)` | Subscription checks used by login and the account page. |

Because `getSession()` re-validates on every call, editing localStorage by hand cannot fake a session.

## State

Redux Toolkit, one slice per entity, all sharing the same shape:

```ts
{
  byScope: { "volt:en": Invoice[], "volt:ar": Invoice[] },
  statusByScope: { "volt:en": "ready" }
}
```

- **The scope key** is `companyId:language`, built by `hooks/useDataScope.ts`. Two companies never share a cache entry, and each language keeps its own localized copy.
- **`store/createScopedSlice.ts`** builds the fetch thunk plus `itemAdded` / `itemUpdated` / `itemRemoved` for any entity with an `id`. Products, customers, orders and invoices are one-liners on top of it.
- **`store/supportSlice.ts`** and **`store/notificationsSlice.ts`** are written by hand because they need extra reducers (`ticketReplied`, `allNotificationsRead`).
- **`store/index.ts`** wraps every slice in `persistReducer` with `whitelist: ["byScope"]`, so cached data survives a refresh but load statuses do not.
- **`store/hooks.ts`** exports the typed `useAppDispatch` / `useAppSelector`.

## Data fetching

1. A page calls `useDataScope()` and reads `state.<entity>.byScope[scope]`.
2. If that entry is missing, it dispatches the slice's fetch thunk in an effect.
3. The thunk calls `features/private/api/<entity>.ts`, which delegates to `getCompanyList()` in `api/client.ts`.
4. `lib/api-client.ts` attaches the token and `Accept-Language`, and in mock mode rewrites the URL to `/mock/{lang}/{resource}/{company}.json`.
5. The reducer stores the result under the scope key; redux-persist writes it to localStorage.

Mutations (add/edit/delete) are local-only — they update the store, which persists, but never hit the network.

## Styling and theming

- Tailwind v4 with design tokens declared in `src/index.css` (`:root` for light, `.dark` for dark).
- `components/theme-provider.tsx` toggles the `dark` class on `<html>` and remembers the choice.
- Direction is driven by i18next: `lib/i18n.ts` sets `dir="rtl"` for Arabic, so logical utilities (`ms-`, `pe-`, `text-start`, `start-0`) flip automatically.
- Numbers and money use `dir="ltr"` on the element that contains them so they stay readable in Arabic.

## Conventions

- Imports use the `@/` alias for `src`.
- Feature code lives under `features/private` (behind login) or `features/public`.
- Status constants live next to their types in `features/private/types/*` and drive both the filters and the form selects.
- No comments in components — names and structure carry the meaning.
