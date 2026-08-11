import type { Stat } from "@/features/dashboard/types"
import { api } from "@/lib/api-client"

export async function getStats() {
  const { data } = await api.get<Stat[]>("/dashboard/stats")
  return data
}
