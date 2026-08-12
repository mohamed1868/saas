import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function initialsOf(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)

  if (parts.length === 0) return "?"
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()

  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export function formatMoney(value: number) {
  return `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export function mergeOptions(fromServer: string[] | undefined, fromRecords: string[]) {
  return [...new Set([...(fromServer ?? []), ...fromRecords])].sort((a, b) => a.localeCompare(b))
}

export function dataScope(companyId: string, language: string) {
  return `${companyId}:${language}`
}
