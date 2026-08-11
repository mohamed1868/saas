import type { Credentials, SignInResponse } from "@/features/auth/types"
import { api } from "@/lib/api-client"

export async function signIn(credentials: Credentials) {
  const { data } = await api.post<SignInResponse>("/auth/login", credentials)
  return data
}
