import { useTranslation } from "react-i18next"

import { SectionCard } from "@/features/private/dashboard/components/SectionCard"
import type { Product } from "@/features/private/dashboard/types/dashboard"

export function TopProducts({
  products,
  onRefresh,
}: {
  products: Product[]
  onRefresh: () => void
}) {
  const { t } = useTranslation()

  return (
    <SectionCard title={t("products")} onRefresh={onRefresh} contentClassName="flex flex-col gap-3">
      <div className="flex items-center justify-between border-b border-border/70 pb-2 text-xs text-muted-foreground">
        <span>{t("product")}</span>
        <span>{t("price")}</span>
      </div>

      <ul className="grid gap-4">
        {products.map((product) => (
          <li key={product.id} className="flex items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary/30 to-chart-2/30 text-sm font-semibold">
              {product.name.charAt(0)}
            </span>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{product.name}</p>
              <p className="truncate text-xs text-muted-foreground">{product.category}</p>
            </div>

            <span dir="ltr" className="text-sm font-medium tabular-nums">
              {product.price}
            </span>
          </li>
        ))}
      </ul>
    </SectionCard>
  )
}
