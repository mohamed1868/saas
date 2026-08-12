import { Pencil, Trash2 } from "lucide-react"
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
import type {
  Customer,
  CustomerStatus,
  CustomerType,
} from "@/features/private/types/customers"
import { cn, formatMoney, initialsOf } from "@/lib/utils"

const STATUS_STYLES: Record<CustomerStatus, string> = {
  active: "bg-chart-4/15 text-chart-4",
  inactive: "bg-muted text-muted-foreground",
  blocked: "bg-destructive/15 text-destructive",
}

const TYPE_STYLES: Record<CustomerType, string> = {
  retail: "bg-chart-2/15 text-chart-2",
  wholesale: "bg-chart-3/15 text-chart-3",
  vip: "bg-chart-1/15 text-chart-1",
}

type CustomersTableProps = {
  customers: Customer[]
  onEdit: (customer: Customer) => void
  onDelete: (customer: Customer) => void
}

export function CustomersTable({ customers, onEdit, onDelete }: CustomersTableProps) {
  const { t } = useTranslation()

  return (
    <Table>
      <TableHeader>
        <TableRow className="border-border/70 hover:bg-transparent">
          <TableHead className="text-xs">{t("customer")}</TableHead>
          <TableHead className="text-xs">{t("phone")}</TableHead>
          <TableHead className="text-xs">{t("city")}</TableHead>
          <TableHead className="text-xs">{t("customerType")}</TableHead>
          <TableHead className="text-xs">{t("orders")}</TableHead>
          <TableHead className="text-xs">{t("totalSpent")}</TableHead>
          <TableHead className="text-xs">{t("status")}</TableHead>
          <TableHead className="text-end text-xs">{t("actions")}</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {customers.map((customer) => (
          <TableRow key={customer.id} className="border-border/70">
            <TableCell>
              <div className="flex items-center gap-3">
                <Avatar className="size-9">
                  <AvatarFallback className="bg-secondary text-xs">
                    {initialsOf(customer.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{customer.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{customer.email}</p>
                </div>
              </div>
            </TableCell>

            <TableCell dir="ltr" className="text-start text-sm whitespace-nowrap text-muted-foreground">
              {customer.phone}
            </TableCell>

            <TableCell className="text-sm whitespace-nowrap text-muted-foreground">
              {customer.city}
            </TableCell>

            <TableCell>
              <span
                className={cn(
                  "inline-flex rounded-full px-2.5 py-1 text-xs font-medium",
                  TYPE_STYLES[customer.type],
                )}
              >
                {t(`customerType_${customer.type}`)}
              </span>
            </TableCell>

            <TableCell className="text-sm tabular-nums">{customer.orders}</TableCell>

            <TableCell dir="ltr" className="text-start text-sm font-medium tabular-nums">
              {formatMoney(customer.totalSpent)}
            </TableCell>

            <TableCell>
              <span
                className={cn(
                  "inline-flex rounded-full px-2.5 py-1 text-xs font-medium",
                  STATUS_STYLES[customer.status],
                )}
              >
                {t(`customerStatus_${customer.status}`)}
              </span>
            </TableCell>

            <TableCell>
              <div className="flex items-center justify-end gap-1">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={t("edit")}
                  onClick={() => onEdit(customer)}
                >
                  <Pencil className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={t("delete")}
                  className="text-destructive hover:text-destructive"
                  onClick={() => onDelete(customer)}
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
