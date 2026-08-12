export const INVOICE_STATUSES = ["draft", "sent", "paid", "overdue", "cancelled"] as const

export type InvoiceStatus = (typeof INVOICE_STATUSES)[number]

export type InvoiceItem = {
  productId: string
  name: string
  price: number
  quantity: number
}

export type Invoice = {
  id: string
  number: string
  customerId: string
  customerName: string
  issueDate: string
  dueDate: string
  status: InvoiceStatus
  items: InvoiceItem[]
  subtotal: number
  discount: number
  taxRate: number
  tax: number
  total: number
}

export type InvoiceDraft = Omit<Invoice, "id">
