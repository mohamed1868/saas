export const PATHS = {
  root: "/",

  login: "/login",
  plans: "/plans",

  dashboard: "/dashboard",
} as const

export type Path = (typeof PATHS)[keyof typeof PATHS]
