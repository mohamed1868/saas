import { LifeBuoy, Plus } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"

import { ConfirmDialog } from "@/components/shared/ConfirmDialog"
import { TablePagination } from "@/components/shared/TablePagination"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { NewTicketDialog } from "@/features/private/components/support/NewTicketDialog"
import { SupportChannels } from "@/features/private/components/support/SupportChannels"
import { SupportTable } from "@/features/private/components/support/SupportTable"
import { SupportToolbar } from "@/features/private/components/support/SupportToolbar"
import { TicketThreadDialog } from "@/features/private/components/support/TicketThreadDialog"
import type { Ticket, TicketStatus } from "@/features/private/types/support"
import { getSession } from "@/features/public/lib/session"
import { usePagedList } from "@/hooks/usePagedList"
import { dataScope, timestamp } from "@/lib/utils"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import {
  fetchTickets,
  ticketAdded,
  ticketRemoved,
  ticketReplied,
  ticketUpdated,
} from "@/store/supportSlice"

const PAGE_SIZE = 8

const NO_TICKETS: Ticket[] = []

function nextNumber(tickets: Ticket[]) {
  const highest = tickets.reduce(
    (max, ticket) => Math.max(max, Number(ticket.number.replace("TCK-", "")) || 0),
    1200,
  )

  return `TCK-${highest + 1}`
}

export default function SupportPage() {
  const { t, i18n } = useTranslation()
  const dispatch = useAppDispatch()

  const session = getSession()
  const companyId = session?.company.id ?? ""
  const scope = companyId ? dataScope(companyId, i18n.language) : ""

  const stored = useAppSelector((state) => state.support.byScope[scope])
  const status = useAppSelector((state) => state.support.statusByScope[scope] ?? "idle")
  const tickets = stored ?? NO_TICKETS

  useEffect(() => {
    if (scope && !stored) dispatch(fetchTickets(scope))
  }, [scope, stored, dispatch])

  const [search, setSearch] = useState("")
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([])
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([])

  const [creating, setCreating] = useState(false)
  const [opened, setOpened] = useState<Ticket | null>(null)
  const [deleting, setDeleting] = useState<Ticket | null>(null)

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()

    return tickets.filter((ticket) => {
      if (selectedStatuses.length > 0 && !selectedStatuses.includes(ticket.status)) return false
      if (selectedPriorities.length > 0 && !selectedPriorities.includes(ticket.priority))
        return false
      if (!term) return true

      return (
        ticket.subject.toLowerCase().includes(term) ||
        ticket.number.toLowerCase().includes(term)
      )
    })
  }, [tickets, search, selectedStatuses, selectedPriorities])

  const paged = usePagedList(filtered, PAGE_SIZE)
  const openCount = tickets.filter((ticket) => ticket.status === "open").length

  const current = opened ? (tickets.find((ticket) => ticket.id === opened.id) ?? opened) : null

  function clearFilters() {
    setSearch("")
    setSelectedStatuses([])
    setSelectedPriorities([])
    paged.resetPage()
  }

  function createTicket(values: {
    subject: string
    category: Ticket["category"]
    priority: Ticket["priority"]
    message: string
  }) {
    const at = timestamp()

    dispatch(
      ticketAdded({
        scope,
        ticket: {
          id: crypto.randomUUID(),
          number: nextNumber(tickets),
          subject: values.subject,
          category: values.category,
          priority: values.priority,
          status: "open",
          createdAt: at,
          updatedAt: at,
          messages: [
            {
              id: crypto.randomUUID(),
              from: "company",
              author: session?.name ?? "",
              body: values.message,
              at,
            },
          ],
        },
      }),
    )

    paged.resetPage()
  }

  function reply(body: string) {
    if (!current) return

    dispatch(
      ticketReplied({
        scope,
        id: current.id,
        message: {
          id: crypto.randomUUID(),
          from: "company",
          author: session?.name ?? "",
          body,
          at: timestamp(),
        },
      }),
    )
  }

  function changeStatus(next: TicketStatus) {
    if (!current) return

    dispatch(
      ticketUpdated({ scope, id: current.id, changes: { status: next, updatedAt: timestamp() } }),
    )
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{t("support")}</h1>
          <p className="text-sm text-muted-foreground">
            {t("supportSubtitle", { count: openCount })}
          </p>
        </div>

        <Button
          onClick={() => setCreating(true)}
          className="bg-linear-to-r from-primary to-chart-3 text-white hover:brightness-110"
        >
          <Plus className="size-4" />
          {t("newTicket")}
        </Button>
      </div>

      <SupportChannels />

      <SupportToolbar
        search={search}
        selectedStatuses={selectedStatuses}
        selectedPriorities={selectedPriorities}
        onSearchChange={(value) => {
          setSearch(value)
          paged.resetPage()
        }}
        onStatusesChange={(values) => {
          setSelectedStatuses(values)
          paged.resetPage()
        }}
        onPrioritiesChange={(values) => {
          setSelectedPriorities(values)
          paged.resetPage()
        }}
        onClear={clearFilters}
      />

      <Card className="overflow-hidden rounded-xl border-border/70">
        {status === "loading" ? (
          <div className="space-y-3 p-5">
            {Array.from({ length: 6 }, (_, index) => (
              <Skeleton key={index} className="h-12 w-full" />
            ))}
          </div>
        ) : status === "failed" ? (
          <div className="flex flex-col items-center gap-3 p-10">
            <p className="text-sm text-destructive">{t("ticketsLoadFailed")}</p>
            <Button variant="outline" size="sm" onClick={() => dispatch(fetchTickets(scope))}>
              {t("retry")}
            </Button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-3 p-12 text-center">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
              <LifeBuoy className="size-6" />
            </span>
            <p className="text-sm text-muted-foreground">{t("noTickets")}</p>
            <Button variant="outline" size="sm" onClick={clearFilters}>
              {t("clearFilters")}
            </Button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <SupportTable tickets={paged.visible} onOpen={setOpened} onDelete={setDeleting} />
            </div>

            <TablePagination
              page={paged.page}
              pageCount={paged.pageCount}
              from={paged.from}
              to={paged.to}
              total={paged.total}
              onPageChange={paged.setPage}
            />
          </>
        )}
      </Card>

      {creating && (
        <NewTicketDialog onSubmit={createTicket} onClose={() => setCreating(false)} />
      )}

      {current && (
        <TicketThreadDialog
          ticket={current}
          onReply={reply}
          onStatusChange={changeStatus}
          onClose={() => setOpened(null)}
        />
      )}

      {deleting && (
        <ConfirmDialog
          title={t("deleteTicket")}
          description={t("deleteTicketBody", { number: deleting.number })}
          confirmLabel={t("delete")}
          onConfirm={() => {
            dispatch(ticketRemoved({ scope, id: deleting.id }))
            setDeleting(null)
          }}
          onClose={() => setDeleting(null)}
        />
      )}
    </div>
  )
}
