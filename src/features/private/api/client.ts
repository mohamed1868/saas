import { getSession } from "@/features/public/lib/session"
import { api } from "@/lib/api-client"

export async function getCompanyResource<T>(resource: string) {
  const session = getSession()

  if (!session) throw new Error("noSession")

  const { data } = await api.get<T>(`/${resource}/${session.company.id}`)

  return data
}

export async function getCompanyList<T>(resource: string) {
  const data = await getCompanyResource<T[]>(resource)

  if (!Array.isArray(data)) throw new Error(`invalidResponse:${resource}`)

  return data
}
