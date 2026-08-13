# FluxSync documentation

Each page has its own document. Cross-cutting concerns (routing, state, styling, data) are documented separately.

## Pages

| Page | Route | Document |
| --- | --- | --- |
| Dashboard | `/dashboard` | [pages/dashboard.md](pages/dashboard.md) |
| Products | `/dashboard/products` | [pages/products.md](pages/products.md) |
| Customers | `/dashboard/customers` | [pages/customers.md](pages/customers.md) |
| Orders | `/dashboard/orders` | [pages/orders.md](pages/orders.md) |
| Invoices | `/dashboard/invoices` | [pages/invoices.md](pages/invoices.md) |
| Support | `/dashboard/support` | [pages/support.md](pages/support.md) |
| Notifications | `/dashboard/notifications` | [pages/notifications.md](pages/notifications.md) |
| Account | `/dashboard/account` | [pages/account.md](pages/account.md) |
| Login | `/login` | [pages/login.md](pages/login.md) |
| Plans | `/plans` | [pages/plans.md](pages/plans.md) |
| Errors | `*` | [pages/errors.md](pages/errors.md) |

## Cross-cutting

| Topic | Document |
| --- | --- |
| App shell, routing, state, sessions | [architecture.md](architecture.md) |
| Layouts, shared components, UI kit | [shared-components.md](shared-components.md) |
| Mock API, translations, data scoping | [data.md](data.md) |
| Build config, env vars, tooling | [configuration.md](configuration.md) |

## Reading order

New to the codebase? Start with [architecture.md](architecture.md), then read one page document — every list page ([products](pages/products.md), [customers](pages/customers.md), [orders](pages/orders.md), [invoices](pages/invoices.md), [support](pages/support.md)) follows the same skeleton, so one is enough to recognise the rest.
