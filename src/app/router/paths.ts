export const PATHS = {
  root: "/",

  login: "/login",
  register: "/register",

  dashboard: "/dashboard",
  reports: "/dashboard/reports",
  products: "/dashboard/products",
  tasks: "/dashboard/tasks",
  users: "/users",
  pricing: "/pricing",
  settings: "/settings",
} as const

export type Path = (typeof PATHS)[keyof typeof PATHS]
