import { Eye, Pencil, Trash2 } from "lucide-react"
import { useTranslation } from "react-i18next"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { Invoice, InvoiceStatus } from "@/features/private/types/invoices"
import { cn, formatMoney, initialsOf } from "@/lib/utils"

const STATUS_STYLES: Record<InvoiceStatus, string> = {
  draft: "bg-muted text-muted-foreground",
  sent: "bg-chart-2/15 text-chart-2",
  paid: "bg-chart-4/15 text-chart-4",
  overdue: "bg-destructive/15 text-destructive",
  cancelled: "bg-chart-5/15 text-chart-5",
}

type InvoicesTableProps = {
  invoices: Invoice[]
  onOpen: (invoice: Invoice) => void
  onEdit: (invoice: Invoice) => void
  onDelete: (invoice: Invoice) => void
}

export function InvoicesTable({ invoices, onOpen, onEdit, onDelete }: InvoicesTableProps) {
  const { t } = useTranslation()

  return (
    <Table>
      <TableHeader>
        <TableRow className="border-border/70 hover:bg-transparent">
          <TableHead className="text-xs">{t("invoice")}</TableHead>
          <TableHead className="text-xs">{t("customer")}</TableHead>
          <TableHead className="text-xs">{t("issueDate")}</TableHead>
          <TableHead className="text-xs">{t("dueDate")}</TableHead>
          <TableHead className="text-xs">{t("status")}</TableHead>
          <TableHead className="text-xs">{t("total")}</TableHead>
          <TableHead className="text-end text-xs">{t("actions")}</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {invoices.map((invoice) => (
          <TableRow key={invoice.id} className="border-border/70">
            <TableCell dir="ltr" className="text-start text-sm font-medium whitespace-nowrap">
              {invoice.number}
            </TableCell>

            <TableCell>
              <div className="flex items-center gap-2.5">
                <Avatar className="size-8">
                  <AvatarFallback className="bg-secondary text-xs">
                    {initialsOf(invoice.customerName)}
                  </AvatarFallback>
                </Avatar>
                <span className="truncate text-sm">{invoice.customerName}</span>
              </div>
            </TableCell>

            <TableCell className="text-sm whitespace-nowrap text-muted-foreground">
              {invoice.issueDate}
            </TableCell>

            <TableCell className="text-sm whitespace-nowrap text-muted-foreground">
              {invoice.dueDate}
            </TableCell>

            <TableCell>
              <span
                className={cn(
                  "inline-flex rounded-full px-2.5 py-1 text-xs font-medium",
                  STATUS_STYLES[invoice.status],
                )}
              >
                {t(`invoiceStatus_${invoice.status}`)}
              </span>
            </TableCell>

            <TableCell dir="ltr" className="text-start text-sm font-medium tabular-nums">
              {formatMoney(invoice.total)}
            </TableCell>

            <TableCell>
              <div className="flex items-center justify-end gap-1">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={t("viewInvoice")}
                  onClick={() => onOpen(invoice)}
                >
                  <Eye className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={t("edit")}
                  onClick={() => onEdit(invoice)}
                >
                  <Pencil className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={t("delete")}
                  className="text-destructive hover:text-destructive"
                  onClick={() => onDelete(invoice)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
