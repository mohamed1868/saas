import { ACCOUNTS } from "@/features/public/login/data/accounts"
import type { AuthUser, Plan } from "@/features/public/login/types/login"

const TOKEN_KEY = "token"
const USER_KEY = "user"
const DAY = 24 * 60 * 60 * 1000

export function isPlanActive(plan: Plan) {
  return new Date(`${plan.expiresAt}T23:59:59`).getTime() >= Date.now()
}

export function daysLeft(plan: Plan) {
  const remaining = new Date(`${plan.expiresAt}T23:59:59`).getTime() - Date.now()
  return Math.max(0, Math.ceil(remaining / DAY))
}

export function saveSession(token: string, user: AuthUser) {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export function getSession(): AuthUser | null {
  const token = localStorage.getItem(TOKEN_KEY)
  const raw = localStorage.getItem(USER_KEY)

  if (!token || !raw) {
    clearSession()
    return null
  }

  const account = ACCOUNTS.find((a) => a.token === token)

  if (!account || !isPlanActive(account.user.plan)) {
    clearSession()
    return null
  }

  try {
    const stored = JSON.parse(raw) as AuthUser

    if (stored?.id !== account.user.id || stored?.email !== account.user.email) {
      clearSession()
      return null
    }

    return account.user
  } catch {
    clearSession()
    return null
  }
}
