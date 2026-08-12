import { useEffect, useState } from "react"

import { api } from "@/lib/api-client"

type Lookups = {
  categories: string[]
  cities: string[]
}

const EMPTY: Lookups = { categories: [], cities: [] }

const requests = new Map<string, Promise<Lookups>>()

export function useLookups(companyId: string) {
  const [lookups, setLookups] = useState(EMPTY)

  useEffect(() => {
    if (!companyId) return

    if (!requests.has(companyId)) {
      requests.set(
        companyId,
        api.get<Lookups>(`/lookups/${companyId}`).then((response) => response.data),
      )
    }

    let active = true

    requests
      .get(companyId)
      ?.then((data) => {
        if (active) setLookups(data)
      })
      .catch(() => {
        requests.delete(companyId)
      })

    return () => {
      active = false
    }
  }, [companyId])

  return lookups
}
