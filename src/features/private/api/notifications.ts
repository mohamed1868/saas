import { getCompanyList } from "@/features/private/api/client"
import type { Notification } from "@/features/private/types/notifications"

export function getNotifications() {
  return getCompanyList<Notification>("notifications")
}
