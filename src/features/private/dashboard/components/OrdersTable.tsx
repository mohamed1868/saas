import { useTranslation } from "react-i18next"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { SectionCard } from "@/features/private/dashboard/components/SectionCard"
import type { Order, OrderStatus } from "@/features/private/dashboard/types/dashboard"
import { cn } from "@/lib/utils"

const STATUS_STYLES: Record<OrderStatus, string> = {
  complete: "bg-chart-4/15 text-chart-4",
  cancelled: "bg-destructive/15 text-destructive",
  pending: "bg-chart-5/15 text-chart-5",
}

const headStyle = "h-9 px-3 text-xs font-normal first:ps-0 last:pe-0"
const cellStyle = "px-3 py-3 first:ps-0 last:pe-0"

export function OrdersTable({ orders, onRefresh }: { orders: Order[]; onRefresh: () => void }) {
  const { t } = useTranslation()

  return (
    <SectionCard title={t("ordersStatus")} onRefresh={onRefresh} contentClassName="min-w-0">
      <Table className="min-w-184 table-fixed">
        <TableHeader>
          <TableRow className="border-border/70 hover:bg-transparent">
            <TableHead className={cn(headStyle, "w-[13%]")}>{t("order")}</TableHead>
            <TableHead className={cn(headStyle, "w-[29%]")}>{t("client")}</TableHead>
            <TableHead className={cn(headStyle, "w-[17%]")}>{t("date")}</TableHead>
            <TableHead className={cn(headStyle, "w-[14%]")}>{t("status")}</TableHead>
            <TableHead className={cn(headStyle, "w-[13%]")}>{t("country")}</TableHead>
            <TableHead className={cn(headStyle, "w-[14%] text-end")}>{t("total")}</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id} className="border-border/70">
              <TableCell className={cn(cellStyle, "text-sm font-medium")}>
                <span dir="ltr">{order.id}</span>
              </TableCell>

              <TableCell className={cellStyle}>
                <div className="flex items-center gap-2.5">
                  <Avatar className="size-8 shrink-0">
                    <AvatarFallback className="bg-secondary text-xs">
                      {order.client.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 leading-tight">
                    <p className="truncate text-sm font-medium">{order.client.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{order.client.email}</p>
                  </div>
                </div>
              </TableCell>

              <TableCell className={cn(cellStyle, "truncate text-sm text-muted-foreground")}>
                {order.date}
              </TableCell>

              <TableCell className={cellStyle}>
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium",
                    STATUS_STYLES[order.status],
                  )}
                >
                  <span className="size-1.5 rounded-full bg-current" />
                  {t(order.status)}
                </span>
              </TableCell>

              <TableCell className={cn(cellStyle, "truncate text-sm text-muted-foreground")}>
                {order.country}
              </TableCell>

              <TableCell className={cn(cellStyle, "text-end text-sm font-medium")}>
                <span dir="ltr">{order.total}</span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </SectionCard>
  )
}
