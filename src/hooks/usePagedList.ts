import { useState } from "react"

export type PagedList<T> = {
  visible: T[]
  page: number
  pageCount: number
  from: number
  to: number
  total: number
  setPage: (page: number) => void
  resetPage: () => void
}

export function usePagedList<T>(items: T[], pageSize: number): PagedList<T> {
  const [page, setPage] = useState(1)

  const pageCount = Math.max(1, Math.ceil(items.length / pageSize))
  const current = Math.min(page, pageCount)
  const start = (current - 1) * pageSize
  const visible = items.slice(start, start + pageSize)

  return {
    visible,
    page: current,
    pageCount,
    from: start + 1,
    to: start + visible.length,
    total: items.length,
    setPage,
    resetPage: () => setPage(1),
  }
}
