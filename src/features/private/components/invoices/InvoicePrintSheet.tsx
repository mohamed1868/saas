import { createPortal } from "react-dom"
import { useTranslation } from "react-i18next"

import type { Invoice } from "@/features/private/types/invoices"
import { getSession } from "@/features/public/lib/session"
import { formatMoney } from "@/lib/utils"

type InvoicePrintSheetProps = {
  invoice: Invoice
}

export function InvoicePrintSheet({ invoice }: InvoicePrintSheetProps) {
  const { t } = useTranslation()
  const session = getSession()

  return createPortal(
    <div className="print-sheet">
      <div className="mx-auto max-w-3xl px-2 py-4 text-neutral-900">
        <header className="flex items-start justify-between gap-8 border-b-2 border-neutral-900 pb-5">
          <div className="space-y-1">
            <p className="text-xl font-bold">{session?.company.name}</p>
            <p className="text-sm text-neutral-600">{t(session?.company.industryKey ?? "")}</p>
            <p dir="ltr" className="text-start text-sm text-neutral-600">
              {session?.email}
            </p>
          </div>

          <div className="space-y-1 text-end">
            <p className="text-2xl font-bold tracking-wide uppercase">{t("invoice")}</p>
            <p dir="ltr" className="text-sm font-medium">
              {invoice.number}
            </p>
            <p className="text-sm text-neutral-600">
              {t(`invoiceStatus_${invoice.status}`)}
            </p>
          </div>
        </header>

        <section className="grid grid-cols-2 gap-8 py-6">
          <div className="space-y-1">
            <p className="text-xs font-semibold tracking-wide text-neutral-500 uppercase">
              {t("billedTo")}
            </p>
            <p className="text-base font-medium">{invoice.customerName}</p>
          </div>

          <div className="space-y-1 text-end">
            <p className="text-sm">
              <span className="text-neutral-500">{t("issueDate")}: </span>
              {invoice.issueDate}
            </p>
            <p className="text-sm">
              <span className="text-neutral-500">{t("dueDate")}: </span>
              {invoice.dueDate}
            </p>
          </div>
        </section>

        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-y border-neutral-300">
              <th className="py-2.5 text-start font-semibold">{t("product")}</th>
              <th className="py-2.5 text-end font-semibold">{t("price")}</th>
              <th className="py-2.5 text-end font-semibold">{t("quantity")}</th>
              <th className="py-2.5 text-end font-semibold">{t("amount")}</th>
            </tr>
          </thead>

          <tbody>
            {invoice.items.map((item) => (
              <tr key={item.productId} className="border-b border-neutral-200">
                <td className="py-2.5">{item.name}</td>
                <td dir="ltr" className="py-2.5 text-end tabular-nums">
                  {formatMoney(item.price)}
                </td>
                <td dir="ltr" className="py-2.5 text-end tabular-nums">
                  {item.quantity}
                </td>
                <td dir="ltr" className="py-2.5 text-end tabular-nums">
                  {formatMoney(item.price * item.quantity)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <section className="mt-6 flex justify-end">
          <div className="w-64 space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-neutral-500">{t("subtotal")}</span>
              <span dir="ltr" className="tabular-nums">
                {formatMoney(invoice.subtotal)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-neutral-500">{t("discount")}</span>
              <span dir="ltr" className="tabular-nums">
                −{formatMoney(invoice.discount)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-neutral-500">
                {t("tax")} ({invoice.taxRate}%)
              </span>
              <span dir="ltr" className="tabular-nums">
                {formatMoney(invoice.tax)}
              </span>
            </div>

            <div className="flex items-center justify-between border-t-2 border-neutral-900 pt-2 text-base font-bold">
              <span>{t("total")}</span>
              <span dir="ltr" className="tabular-nums">
                {formatMoney(invoice.total)}
              </span>
            </div>
          </div>
        </section>

        <footer className="mt-10 border-t border-neutral-200 pt-4 text-center">
          <p className="text-sm font-medium">{t("invoiceThanks")}</p>
          <p className="mt-1 text-xs text-neutral-500">{t("invoiceFooterNote")}</p>
        </footer>
      </div>
    </div>,
    document.body,
  )
}
