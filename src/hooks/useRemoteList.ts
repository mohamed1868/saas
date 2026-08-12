import { useEffect, useState } from "react"

const EMPTY: string[] = []

const requests = new Map<string, Promise<string[]>>()

export function useRemoteList(key: string, load: () => Promise<string[]>) {
  const [items, setItems] = useState(EMPTY)

  useEffect(() => {
    if (!key) return

    if (!requests.has(key)) requests.set(key, load())

    let active = true

    requests
      .get(key)
      ?.then((data) => {
        if (active) setItems(data)
      })
      .catch(() => {
        requests.delete(key)
      })

    return () => {
      active = false
    }
  }, [key, load])

  return items
}
