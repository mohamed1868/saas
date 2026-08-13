import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

type StatusBadgeProps = {
  tone: string
  children: ReactNode
}

export function StatusBadge({ tone, children }: StatusBadgeProps) {
  return (
    <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-medium", tone)}>
      {children}
    </span>
  )
}
