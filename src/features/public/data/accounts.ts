import type { AuthUser } from "@/features/public/types/login"

export type Account = {
  username: string
  password: string
  token: string
  user: AuthUser
}

export const ACCOUNTS: Account[] = [
  {
    username: "volt",
    password: "Volt2026",
    token: "static-token-volt",
    user: {
      id: "u_volt",
      name: "Mohamed Sayed",
      email: "mohamed@volthome.com",
      company: {
        id: "volt",
        name: "Volt Home Appliances",
        industryKey: "industryAppliances",
      },
      plan: { id: "growth", nameKey: "planGrowth", expiresAt: "2027-12-31" },
    },
  },
  {
    username: "aqua",
    password: "Aqua2026",
    token: "static-token-aqua",
    user: {
      id: "u_aqua",
      name: "Sara Adel",
      email: "sara@aquacare.com",
      company: {
        id: "aqua",
        name: "AquaCare Sanitary",
        industryKey: "industrySanitary",
      },
      plan: { id: "starter", nameKey: "planStarter", expiresAt: "2027-09-30" },
    },
  },
]
