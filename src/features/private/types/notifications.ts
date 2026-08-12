export const NOTIFICATION_TYPES = ["order", "stock", "support", "system"] as const

export type NotificationType = (typeof NOTIFICATION_TYPES)[number]

export type Notification = {
  id: string
  type: NotificationType
  title: string
  body: string
  at: string
  read: boolean
}
