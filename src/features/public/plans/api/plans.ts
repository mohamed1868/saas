import type { Plan } from "@/features/public/plans/types/plans"
import { api } from "@/lib/api-client"

export async function getPlans() {
  const { data } = await api.get<Plan[]>("/plans")

  if (!Array.isArray(data)) throw new Error("invalidPlansResponse")

  return data
}
