import { lazy } from "react"

export const LoginPage = lazy(() => import("@/features/public/login/pages/LoginPage"))
export const PlansPage = lazy(() => import("@/features/public/plans/pages/PlansPage"))
export const NotFoundPage = lazy(() => import("@/components/errors/NotFoundPage"))

export const DashboardPage = lazy(() => import("@/features/private/dashboard/pages/DashboardPage"))
export const ProductsPage = lazy(() => import("@/features/private/products/pages/ProductsPage"))
export const CustomersPage = lazy(() => import("@/features/private/customers/pages/CustomersPage"))
