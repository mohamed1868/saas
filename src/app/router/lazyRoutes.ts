import { lazy } from "react"

export const LoginPage = lazy(() => import("@/features/public/pages/LoginPage"))
export const PlansPage = lazy(() => import("@/features/public/pages/PlansPage"))
export const NotFoundPage = lazy(() => import("@/components/errors/NotFoundPage"))

export const DashboardPage = lazy(() => import("@/features/private/pages/DashboardPage"))
export const ProductsPage = lazy(() => import("@/features/private/pages/ProductsPage"))
export const CustomersPage = lazy(() => import("@/features/private/pages/CustomersPage"))
export const OrdersPage = lazy(() => import("@/features/private/pages/OrdersPage"))
export const InvoicesPage = lazy(() => import("@/features/private/pages/InvoicesPage"))
export const SupportPage = lazy(() => import("@/features/private/pages/SupportPage"))
export const AccountPage = lazy(() => import("@/features/private/pages/AccountPage"))
export const NotificationsPage = lazy(() => import("@/features/private/pages/NotificationsPage"))
