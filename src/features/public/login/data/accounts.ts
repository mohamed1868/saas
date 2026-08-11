import type { AuthUser } from "@/features/public/login/types/login"

export type Account = {
  username: string
  password: string
  token: string
  user: AuthUser
}

export const ACCOUNTS: Account[] = [
  {
    username: "admin",
    password: "Flux2026",
    token: "static-token-fluxsync-admin",
    user: {
      id: "u_001",
      name: "Mohamed Sayed",
      email: "mohamed@fluxsync.com",
    },
  },
]

export const DEMO_ACCOUNT = ACCOUNTS[0]
