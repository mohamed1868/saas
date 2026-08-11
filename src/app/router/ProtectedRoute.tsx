import { Navigate, Outlet } from "react-router-dom"

import { getSession } from "@/features/public/login/lib/session"
import { PATHS } from "@/app/router/paths"

export function ProtectedRoute() {
  const user = getSession()

  if (!user) return <Navigate to={PATHS.login} replace />

  return <Outlet />
}
