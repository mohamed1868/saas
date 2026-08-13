import { Pencil, Trash2 } from "lucide-react"
import { useTranslation } from "react-i18next"

import { StatusBadge } from "@/components/shared/StatusBadge"
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
import type {
  Order,
  OrderStatus,
  PaymentStatus,
} from "@/features/private/types/orders"
import { formatMoney, initialsOf } from "@/lib/utils"

const STATUS_STYLES: Record<OrderStatus, string> = {
  pending: "bg-chart-5/15 text-chart-5",
  processing: "bg-chart-2/15 text-chart-2",
  shipped: "bg-chart-3/15 text-chart-3",
  delivered: "bg-chart-4/15 text-chart-4",
  cancelled: "bg-destructive/15 text-destructive",
  returned: "bg-muted text-muted-foreground",
}

const PAYMENT_STYLES: Record<PaymentStatus, string> = {
  paid: "bg-chart-4/15 text-chart-4",
  unpaid: "bg-chart-5/15 text-chart-5",
  refunded: "bg-muted text-muted-foreground",
}

type OrdersTableProps = {
  orders: Order[]
  onEdit: (order: Order) => void
  onDelete: (order: Order) => void
}

export function OrdersTable({ orders, onEdit, onDelete }: OrdersTableProps) {
  const { t } = useTranslation()

  return (
    <Table>
      <TableHeader>
        <TableRow className="border-border/70 hover:bg-transparent">
          <TableHead className="text-xs">{t("order")}</TableHead>
          <TableHead className="text-xs">{t("customer")}</TableHead>
          <TableHead className="text-xs">{t("date")}</TableHead>
          <TableHead className="text-xs">{t("items")}</TableHead>
          <TableHead className="text-xs">{t("status")}</TableHead>
          <TableHead className="text-xs">{t("payment")}</TableHead>
          <TableHead className="text-xs">{t("total")}</TableHead>
          <TableHead className="text-end text-xs">{t("actions")}</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id} className="border-border/70">
            <TableCell dir="ltr" className="text-start text-sm font-medium">
              {order.number}
            </TableCell>

            <TableCell>
              <div className="flex items-center gap-2.5">
                <Avatar className="size-8">
                  <AvatarFallback className="bg-secondary text-xs">
                    {initialsOf(order.customerName)}
                  </AvatarFallback>
                </Avatar>
                <span className="truncate text-sm">{order.customerName}</span>
              </div>
            </TableCell>

            <TableCell className="text-sm whitespace-nowrap text-muted-foreground">
              {order.date}
            </TableCell>

            <TableCell className="text-sm tabular-nums text-muted-foreground">
              {t("itemsCount", { count: order.items.length })}
            </TableCell>

            <TableCell>
              <StatusBadge tone={STATUS_STYLES[order.status]}>
                {t(`orderStatus_${order.status}`)}
              </StatusBadge>
            </TableCell>

            <TableCell>
              <StatusBadge tone={PAYMENT_STYLES[order.payment]}>
                {t(`payment_${order.payment}`)}
              </StatusBadge>
            </TableCell>

            <TableCell dir="ltr" className="text-start text-sm font-medium tabular-nums">
              {formatMoney(order.total)}
            </TableCell>

            <TableCell>
              <div className="flex items-center justify-end gap-1">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={t("edit")}
                  onClick={() => onEdit(order)}
                >
                  <Pencil className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={t("delete")}
                  className="text-destructive hover:text-destructive"
                  onClick={() => onDelete(order)}
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
