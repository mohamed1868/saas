import type { LucideIcon } from "lucide-react"
import type { ReactNode } from "react"
import { useTranslation } from "react-i18next"

import { TablePagination } from "@/components/shared/TablePagination"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import type { PagedList } from "@/hooks/usePagedList"
import type { LoadStatus } from "@/store/createScopedSlice"

type ListCardProps = {
  status: LoadStatus
  errorText: string
  emptyIcon: LucideIcon
  emptyText: string
  isEmpty: boolean
  paged: PagedList<unknown>
  onRetry: () => void
  onClearFilters: () => void
  children: ReactNode
}

export function ListCard({
  status,
  errorText,
  emptyIcon: EmptyIcon,
  emptyText,
  isEmpty,
  paged,
  onRetry,
  onClearFilters,
  children,
}: ListCardProps) {
  const { t } = useTranslation()

  return (
    <Card className="overflow-hidden rounded-xl border-border/70">
      {status === "loading" ? (
        <div className="space-y-3 p-5">
          {Array.from({ length: 6 }, (_, index) => (
            <Skeleton key={index} className="h-12 w-full" />
          ))}
        </div>
      ) : status === "failed" ? (
        <div className="flex flex-col items-center gap-3 p-10">
          <p className="text-sm text-destructive">{errorText}</p>
          <Button variant="outline" size="sm" onClick={onRetry}>
            {t("retry")}
          </Button>
        </div>
      ) : isEmpty ? (
        <div className="flex flex-col items-center gap-3 p-12 text-center">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
            <EmptyIcon className="size-6" />
          </span>
          <p className="text-sm text-muted-foreground">{emptyText}</p>
          <Button variant="outline" size="sm" onClick={onClearFilters}>
            {t("clearFilters")}
          </Button>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">{children}</div>

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
  )
}
