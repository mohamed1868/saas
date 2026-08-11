import { ACCOUNTS } from "@/features/public/login/data/accounts"
import { isPlanActive } from "@/features/public/login/lib/session"
import type { Credentials, SignInResponse } from "@/features/public/login/types/login"

const LATENCY = 700

export async function signIn({ username, password }: Credentials): Promise<SignInResponse> {
  await new Promise((resolve) => setTimeout(resolve, LATENCY))

  const account = ACCOUNTS.find(
    (a) => a.username.toLowerCase() === username.trim().toLowerCase() && a.password === password,
  )

  if (!account) throw new Error("invalidCredentials")
  if (!isPlanActive(account.user.plan)) throw new Error("planExpired")

  return { token: account.token, user: account.user }
}
