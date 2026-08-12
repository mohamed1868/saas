import { Printer } from "lucide-react"
import { useTranslation } from "react-i18next"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { InvoicePrintSheet } from "@/features/private/components/invoices/InvoicePrintSheet"
import {
  INVOICE_STATUSES,
  type Invoice,
  type InvoiceStatus,
} from "@/features/private/types/invoices"
import { formatMoney } from "@/lib/utils"

type InvoiceDetailsDialogProps = {
  invoice: Invoice
  onStatusChange: (status: InvoiceStatus) => void
  onClose: () => void
}

export function InvoiceDetailsDialog({
  invoice,
  onStatusChange,
  onClose,
}: InvoiceDetailsDialogProps) {
  const { t } = useTranslation()

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle dir="ltr" className="text-start">
            {invoice.number}
          </DialogTitle>
          <DialogDescription>{invoice.customerName}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-wrap items-center gap-3">
          <Select value={invoice.status} onValueChange={onStatusChange}>
            <SelectTrigger className="h-9 w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {INVOICE_STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {t(`invoiceStatus_${status}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {invoice.status !== "paid" && (
            <Button variant="outline" size="sm" onClick={() => onStatusChange("paid")}>
              {t("markPaid")}
            </Button>
          )}
        </div>

        <div className="grid gap-3 rounded-xl border border-border/70 p-4 sm:grid-cols-2">
          <div>
            <p className="text-xs text-muted-foreground">{t("issueDate")}</p>
            <p className="text-sm font-medium">{invoice.issueDate}</p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">{t("dueDate")}</p>
            <p className="text-sm font-medium">{invoice.dueDate}</p>
          </div>
        </div>

        <div className="rounded-xl border border-border/70">
          <ul className="divide-y divide-border/70">
            {invoice.items.map((item) => (
              <li
                key={item.productId}
                className="flex items-center justify-between gap-3 px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{item.name}</p>
                  <p dir="ltr" className="text-xs text-muted-foreground">
                    {formatMoney(item.price)} × {item.quantity}
                  </p>
                </div>

                <span dir="ltr" className="text-sm tabular-nums">
                  {formatMoney(item.price * item.quantity)}
                </span>
              </li>
            ))}
          </ul>

          <div className="space-y-2 border-t border-border/70 px-4 py-3">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{t("subtotal")}</span>
              <span dir="ltr" className="tabular-nums">
                {formatMoney(invoice.subtotal)}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{t("discount")}</span>
              <span dir="ltr" className="tabular-nums">
                −{formatMoney(invoice.discount)}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>
                {t("tax")} ({invoice.taxRate}%)
              </span>
              <span dir="ltr" className="tabular-nums">
                {formatMoney(invoice.tax)}
              </span>
            </div>

            <div className="flex items-center justify-between border-t border-border/70 pt-2">
              <span className="text-sm font-medium">{t("total")}</span>
              <span dir="ltr" className="text-lg font-semibold tabular-nums">
                {formatMoney(invoice.total)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            {t("close")}
          </Button>
          <Button
            onClick={() => window.print()}
            className="bg-linear-to-r from-primary to-chart-3 text-white hover:brightness-110"
          >
            <Printer className="size-4" />
            {t("printInvoice")}
          </Button>
        </div>
      </DialogContent>

      <InvoicePrintSheet invoice={invoice} />
    </Dialog>
  )
}
