export const TICKET_STATUSES = ["open", "pending", "resolved", "closed"] as const

export const TICKET_PRIORITIES = ["low", "medium", "high", "urgent"] as const

export const TICKET_CATEGORIES = ["technical", "billing", "account", "feature"] as const

export type TicketStatus = (typeof TICKET_STATUSES)[number]

export type TicketPriority = (typeof TICKET_PRIORITIES)[number]

export type TicketCategory = (typeof TICKET_CATEGORIES)[number]

export type TicketMessage = {
  id: string
  from: "company" | "support"
  author: string
  body: string
  at: string
}

export type Ticket = {
  id: string
  number: string
  subject: string
  category: TicketCategory
  priority: TicketPriority
  status: TicketStatus
  createdAt: string
  updatedAt: string
  messages: TicketMessage[]
}

export type TicketDraft = Omit<Ticket, "id">
