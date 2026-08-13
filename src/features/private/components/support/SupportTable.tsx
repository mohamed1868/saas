import { MessageSquare, Trash2 } from "lucide-react"
import { useTranslation } from "react-i18next"

import { StatusBadge } from "@/components/shared/StatusBadge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type {
  Ticket,
  TicketPriority,
  TicketStatus,
} from "@/features/private/types/support"
import { formatDateTime } from "@/lib/utils"

const STATUS_STYLES: Record<TicketStatus, string> = {
  open: "bg-chart-2/15 text-chart-2",
  pending: "bg-chart-5/15 text-chart-5",
  resolved: "bg-chart-4/15 text-chart-4",
  closed: "bg-muted text-muted-foreground",
}

const PRIORITY_STYLES: Record<TicketPriority, string> = {
  low: "bg-muted text-muted-foreground",
  medium: "bg-chart-2/15 text-chart-2",
  high: "bg-chart-5/15 text-chart-5",
  urgent: "bg-destructive/15 text-destructive",
}

type SupportTableProps = {
  tickets: Ticket[]
  onOpen: (ticket: Ticket) => void
  onDelete: (ticket: Ticket) => void
}

export function SupportTable({ tickets, onOpen, onDelete }: SupportTableProps) {
  const { t, i18n } = useTranslation()

  return (
    <Table>
      <TableHeader>
        <TableRow className="border-border/70 hover:bg-transparent">
          <TableHead className="text-xs">{t("ticket")}</TableHead>
          <TableHead className="text-xs">{t("category")}</TableHead>
          <TableHead className="text-xs">{t("priority")}</TableHead>
          <TableHead className="text-xs">{t("status")}</TableHead>
          <TableHead className="text-xs">{t("lastUpdate")}</TableHead>
          <TableHead className="text-end text-xs">{t("actions")}</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {tickets.map((ticket) => (
          <TableRow key={ticket.id} className="border-border/70">
            <TableCell>
              <button
                type="button"
                onClick={() => onOpen(ticket)}
                className="min-w-0 text-start hover:underline"
              >
                <p className="truncate text-sm font-medium">{ticket.subject}</p>
                <p dir="ltr" className="truncate text-start font-mono text-xs text-muted-foreground">
                  {ticket.number}
                </p>
              </button>
            </TableCell>

            <TableCell className="text-sm whitespace-nowrap text-muted-foreground">
              {t(`ticketCategory_${ticket.category}`)}
            </TableCell>

            <TableCell>
              <StatusBadge tone={PRIORITY_STYLES[ticket.priority]}>
                {t(`ticketPriority_${ticket.priority}`)}
              </StatusBadge>
            </TableCell>

            <TableCell>
              <StatusBadge tone={STATUS_STYLES[ticket.status]}>
                {t(`ticketStatus_${ticket.status}`)}
              </StatusBadge>
            </TableCell>

            <TableCell className="text-sm whitespace-nowrap text-muted-foreground">
              {formatDateTime(ticket.updatedAt, i18n.language)}
            </TableCell>

            <TableCell>
              <div className="flex items-center justify-end gap-1">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={t("openTicket")}
                  onClick={() => onOpen(ticket)}
                >
                  <MessageSquare className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={t("delete")}
                  className="text-destructive hover:text-destructive"
                  onClick={() => onDelete(ticket)}
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
