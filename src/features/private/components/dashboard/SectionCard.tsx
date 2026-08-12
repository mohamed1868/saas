import { MoreHorizontal, RefreshCw } from "lucide-react"
import type { ReactNode } from "react"
import { useTranslation } from "react-i18next"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

type SectionCardProps = {
  title?: ReactNode
  action?: ReactNode
  onRefresh?: () => void
  className?: string
  contentClassName?: string
  children: ReactNode
}

export function SectionCard({
  title,
  action,
  onRefresh,
  className,
  contentClassName,
  children,
}: SectionCardProps) {
  const { t } = useTranslation()

  return (
    <Card className={cn("flex flex-col gap-4 rounded-xl border-border/70 p-5", className)}>
      {(title || action || onRefresh) && (
        <div className="flex items-start justify-between gap-3">
          {typeof title === "string" ? (
            <h2 className="text-sm font-medium text-foreground">{title}</h2>
          ) : (
            title
          )}

          <div className="flex shrink-0 items-center gap-2">
            {action}
            {onRefresh && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={t("cardOptions")}
                    className="text-muted-foreground"
                  >
                    <MoreHorizontal className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={onRefresh}>
                    <RefreshCw />
                    {t("refresh")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      )}

      <div className={cn("flex-1", contentClassName)}>{children}</div>
    </Card>
  )
}
