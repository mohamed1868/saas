import { ChevronLeft, ChevronRight } from "lucide-react"
import { useTranslation } from "react-i18next"

import { Button } from "@/components/ui/button"

type TablePaginationProps = {
  page: number
  pageCount: number
  from: number
  to: number
  total: number
  onPageChange: (page: number) => void
}

export function TablePagination({
  page,
  pageCount,
  from,
  to,
  total,
  onPageChange,
}: TablePaginationProps) {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col items-center justify-between gap-3 border-t border-border/70 px-4 py-3 sm:flex-row">
      <p className="text-xs text-muted-foreground">{t("showingRange", { from, to, total })}</p>

      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft className="size-4 rtl:rotate-180" />
          {t("previous")}
        </Button>

        {Array.from({ length: pageCount }, (_, index) => index + 1).map((item) => (
          <Button
            key={item}
            variant={item === page ? "default" : "ghost"}
            size="icon-sm"
            aria-current={item === page ? "page" : undefined}
            onClick={() => onPageChange(item)}
          >
            {item}
          </Button>
        ))}

        <Button
          variant="outline"
          size="sm"
          disabled={page >= pageCount}
          onClick={() => onPageChange(page + 1)}
        >
          {t("next")}
          <ChevronRight className="size-4 rtl:rotate-180" />
        </Button>
      </div>
    </div>
  )
}
