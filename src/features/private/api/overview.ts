import { getCompanyResource } from "@/features/private/api/client"
import type { Overview } from "@/features/private/types/dashboard"

export async function getOverview() {
  const data = await getCompanyResource<Overview>("dashboard/overview")

  if (!data || !Array.isArray(data.stats)) throw new Error("invalidOverviewResponse")

  return data
}
