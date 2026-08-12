import { getSession } from "@/features/public/lib/session"
import type { Overview } from "@/features/private/types/dashboard"
import { api } from "@/lib/api-client"

export async function getOverview() {
  const session = getSession()

  if (!session) throw new Error("noSession")

  const { data } = await api.get<Overview>(`/dashboard/overview/${session.company.id}`)

  if (!data || !Array.isArray(data.stats)) throw new Error("invalidOverviewResponse")

  return data
}
