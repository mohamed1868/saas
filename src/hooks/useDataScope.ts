import { useTranslation } from "react-i18next"

import { getSession } from "@/features/public/lib/session"
import { dataScope } from "@/lib/utils"

export function useDataScope() {
  const { i18n } = useTranslation()

  const companyId = getSession()?.company.id ?? ""
  const scope = companyId ? dataScope(companyId, i18n.language) : ""

  return { companyId, scope }
}
