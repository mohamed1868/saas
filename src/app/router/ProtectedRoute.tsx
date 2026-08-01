import { Navigate, Outlet } from "react-router-dom"

import { PATHS } from "@/app/router/paths"

export function ProtectedRoute() {
  const token = localStorage.getItem("token")

  if (!token) return <Navigate to={PATHS.login} replace />

  return <Outlet />
}
