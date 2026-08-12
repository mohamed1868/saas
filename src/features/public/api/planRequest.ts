import { siteConfig } from "@/config/site"
import type { PlanRequest } from "@/features/public/types/plans"

const ENDPOINT = "https://api.web3forms.com/submit"
const ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_KEY as string | undefined

export async function requestPlan(request: PlanRequest) {
  if (!ACCESS_KEY) throw new Error("missingFormKey")

  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      access_key: ACCESS_KEY,
      subject: `${siteConfig.name} — plan request: ${request.planId}`,
      from_name: siteConfig.name,
      plan: request.planId,
      company: request.company,
      name: request.name,
      email: request.email,
      phone: request.phone,
      message: request.message?.trim() || "—",
    }),
  })

  const data = (await response.json()) as { success?: boolean; message?: string }

  if (!response.ok || !data.success) throw new Error("requestFailed")

  return data
}
