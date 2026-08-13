# Error pages

Two screens cover everything that falls outside a normal route.

## Not found — `src/components/errors/NotFoundPage.tsx`

Matched by the catch-all `*` route. Shows a large `404`, a short message and a button back to the dashboard. It is a lazy route like any other page.

Translations: `pageNotFound`, `backToDashboard`.

## Render error — `src/components/errors/ErrorPage.tsx`

Registered as the router's `errorElement`, so it catches thrown render errors and failed loaders anywhere in the tree.

- `isRouteErrorResponse(error)` → shows the HTTP status and status text.
- A plain `Error` → shows its message in a scrollable `<pre>`.
- Neither → shows only the generic title and message.

Two actions: reload the page, or go back to the dashboard.

Translations: `errorTitle`, `errorMessage`, `retry`, `backToDashboard`.

## What these do not catch

- **Data-loading failures.** Each page handles its own failed fetch — list pages through `ListCard`'s failure state, the dashboard through the retry button beside its title.
- **Expired or tampered sessions.** `ProtectedRoute` and the 401 interceptor in `lib/api-client.ts` redirect to `/login` instead of surfacing an error.
