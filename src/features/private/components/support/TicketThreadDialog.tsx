import { Send } from "lucide-react"
import { useState } from "react"
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
import {
  TICKET_STATUSES,
  type Ticket,
  type TicketStatus,
} from "@/features/private/types/support"
import { cn, formatDateTime } from "@/lib/utils"

type TicketThreadDialogProps = {
  ticket: Ticket
  onReply: (body: string) => void
  onStatusChange: (status: TicketStatus) => void
  onClose: () => void
}

export function TicketThreadDialog({
  ticket,
  onReply,
  onStatusChange,
  onClose,
}: TicketThreadDialogProps) {
  const { t, i18n } = useTranslation()
  const [reply, setReply] = useState("")

  function send() {
    if (reply.trim().length < 2) return

    onReply(reply.trim())
    setReply("")
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{ticket.subject}</DialogTitle>
          <DialogDescription dir="ltr" className="text-start">
            {ticket.number}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-wrap items-center gap-3">
          <Select value={ticket.status} onValueChange={onStatusChange}>
            <SelectTrigger className="h-9 w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TICKET_STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {t(`ticketStatus_${status}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <span className="text-xs text-muted-foreground">
            {t(`ticketCategory_${ticket.category}`)} · {t(`ticketPriority_${ticket.priority}`)}
          </span>
        </div>

        <ul className="grid gap-3">
          {ticket.messages.map((message) => (
            <li
              key={message.id}
              className={cn(
                "rounded-xl border p-3",
                message.from === "support"
                  ? "border-primary/30 bg-primary/5"
                  : "border-border/70 bg-muted/30",
              )}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-medium">{message.author}</span>
                <span className="text-xs text-muted-foreground">
                  {formatDateTime(message.at, i18n.language)}
                </span>
              </div>

              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{message.body}</p>
            </li>
          ))}
        </ul>

        <div className="space-y-2">
          <textarea
            rows={3}
            value={reply}
            onChange={(event) => setReply(event.target.value)}
            placeholder={t("replyPlaceholder")}
            className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 dark:bg-input/30"
          />

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              {t("close")}
            </Button>
            <Button
              disabled={reply.trim().length < 2}
              onClick={send}
              className="bg-linear-to-r from-primary to-chart-3 text-white hover:brightness-110"
            >
              <Send className="size-4 rtl:-scale-x-100" />
              {t("sendReply")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
