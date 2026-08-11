import type { Stat } from "@/features/private/dashboard/types/dashboard"
import { api } from "@/lib/api-client"

export async function getStats() {
  const { data } = await api.get<Stat[]>("/dashboard/stats")
  return data
}
