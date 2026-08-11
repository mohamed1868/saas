import { lazy } from "react"

export const LoginPage = lazy(() => import("@/features/auth/pages/LoginPage"))
export const NotFoundPage = lazy(() => import("@/components/errors/NotFoundPage"))

export const DashboardPage = lazy(() => import("@/features/dashboard/pages/DashboardPage"))
