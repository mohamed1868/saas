import type { Notification } from "@/features/private/types/notifications"
import { getSession } from "@/features/public/lib/session"
import { api } from "@/lib/api-client"

export async function getNotifications() {
  const session = getSession()

  if (!session) throw new Error("noSession")

  const { data } = await api.get<Notification[]>(`/notifications/${session.company.id}`)

  if (!Array.isArray(data)) throw new Error("invalidNotificationsResponse")

  return data
}
