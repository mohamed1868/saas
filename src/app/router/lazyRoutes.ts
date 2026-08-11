import { lazy } from "react"

export const LoginPage = lazy(() => import("@/features/public/login/pages/LoginPage"))
export const NotFoundPage = lazy(() => import("@/components/errors/NotFoundPage"))

export const DashboardPage = lazy(() => import("@/features/private/dashboard/pages/DashboardPage"))
