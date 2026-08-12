import { Suspense } from "react"
import { createBrowserRouter, Navigate, Outlet } from "react-router-dom"

import MainLayout from "@/components/layouts/MainLayout"
import { PageFallback } from "@/components/shared/PageFallback"
import ErrorPage from "@/components/errors/ErrorPage"
import {
  DashboardPage,
  LoginPage,
  NotFoundPage,
  PlansPage,
  ProductsPage,
} from "@/app/router/lazyRoutes"
import { PATHS } from "@/app/router/paths"
import { ProtectedRoute } from "@/app/router/ProtectedRoute"

export const router = createBrowserRouter([
  {
    element: (
      <Suspense fallback={<PageFallback />}>
        <Outlet />
      </Suspense>
    ),
    errorElement: <ErrorPage />,
    children: [
      { path: PATHS.login, element: <LoginPage /> },
      { path: PATHS.plans, element: <PlansPage /> },

      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <MainLayout />,
            children: [
              { path: PATHS.root, element: <Navigate to={PATHS.dashboard} replace /> },
              { path: PATHS.dashboard, element: <DashboardPage /> },
              { path: PATHS.products, element: <ProductsPage /> },
            ],
          },
        ],
      },

      { path: "*", element: <NotFoundPage /> },
    ],
  },
])
