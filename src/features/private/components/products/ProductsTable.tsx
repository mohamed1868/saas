import { Pencil, Trash2 } from "lucide-react"
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
import type { Product, ProductStatus } from "@/features/private/types/products"
import { cn, formatMoney } from "@/lib/utils"

const LOW_STOCK = 10

const STATUS_STYLES: Record<ProductStatus, string> = {
  active: "bg-chart-4/15 text-chart-4",
  draft: "bg-chart-5/15 text-chart-5",
  archived: "bg-muted text-muted-foreground",
}

type ProductsTableProps = {
  products: Product[]
  onEdit: (product: Product) => void
  onDelete: (product: Product) => void
}

export function ProductsTable({ products, onEdit, onDelete }: ProductsTableProps) {
  const { t } = useTranslation()

  return (
    <Table>
      <TableHeader>
        <TableRow className="border-border/70 hover:bg-transparent">
          <TableHead className="text-xs">{t("product")}</TableHead>
          <TableHead className="text-xs">{t("category")}</TableHead>
          <TableHead className="text-xs">{t("price")}</TableHead>
          <TableHead className="text-xs">{t("stock")}</TableHead>
          <TableHead className="text-xs">{t("status")}</TableHead>
          <TableHead className="text-end text-xs">{t("actions")}</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {products.map((product) => (
          <TableRow key={product.id} className="border-border/70">
            <TableCell>
              <div className="flex items-center gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-primary/30 to-chart-2/30 text-sm font-semibold">
                  {product.name.charAt(0)}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{product.name}</p>
                  <p dir="ltr" className="truncate text-start font-mono text-xs text-muted-foreground">
                    {product.sku}
                  </p>
                </div>
              </div>
            </TableCell>

            <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
              {product.category}
            </TableCell>

            <TableCell dir="ltr" className="text-start text-sm font-medium tabular-nums">
              {formatMoney(product.price)}
            </TableCell>

            <TableCell>
              <span
                className={cn(
                  "text-sm tabular-nums",
                  product.stock === 0 && "text-destructive",
                  product.stock > 0 && product.stock < LOW_STOCK && "text-chart-5",
                )}
              >
                {product.stock}
              </span>
              {product.stock === 0 && (
                <span className="ms-2 text-xs text-destructive">{t("outOfStock")}</span>
              )}
            </TableCell>

            <TableCell>
              <StatusBadge tone={STATUS_STYLES[product.status]}>
                {t(`status_${product.status}`)}
              </StatusBadge>
            </TableCell>

            <TableCell>
              <div className="flex items-center justify-end gap-1">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={t("edit")}
                  onClick={() => onEdit(product)}
                >
                  <Pencil className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={t("delete")}
                  className="text-destructive hover:text-destructive"
                  onClick={() => onDelete(product)}
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
