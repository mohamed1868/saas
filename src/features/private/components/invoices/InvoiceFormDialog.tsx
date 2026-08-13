import { zodResolver } from "@hookform/resolvers/zod"
import { Plus, Trash2 } from "lucide-react"
import { useMemo } from "react"
import { useFieldArray, useForm, useWatch } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Customer } from "@/features/private/types/customers"
import {
  INVOICE_STATUSES,
  type Invoice,
  type InvoiceDraft,
} from "@/features/private/types/invoices"
import type { Product } from "@/features/private/types/products"
import { invoiceTotals } from "@/features/private/lib/invoices"
import { formatMoney } from "@/lib/utils"

const AMOUNT = /^\d+(\.\d{1,2})?$/

function buildSchema(t: (key: string) => string) {
  return z.object({
    customerId: z.string().min(1, t("customerRequired")),
    issueDate: z.string().trim().min(3, t("dateRequired")),
    dueDate: z.string().trim().min(3, t("dueDateRequired")),
    status: z.enum(INVOICE_STATUSES),
    taxRate: z
      .string()
      .regex(AMOUNT, t("taxInvalid"))
      .refine((value) => Number(value) <= 100, t("taxInvalid")),
    discount: z.string().regex(AMOUNT, t("discountInvalid")),
    items: z
      .array(
        z.object({
          productId: z.string().min(1, t("productRequired")),
          quantity: z.string().regex(/^[1-9]\d*$/, t("quantityInvalid")),
        }),
      )
      .min(1, t("itemsRequired")),
  })
}

type FormValues = z.infer<ReturnType<typeof buildSchema>>

type InvoiceFormDialogProps = {
  invoice: Invoice | null
  customers: Customer[]
  products: Product[]
  onSave: (draft: Omit<InvoiceDraft, "number">, id?: string) => void
  onClose: () => void
}

export function InvoiceFormDialog({
  invoice,
  customers,
  products,
  onSave,
  onClose,
}: InvoiceFormDialogProps) {
  const { t } = useTranslation()
  const schema = useMemo(() => buildSchema(t), [t])

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      customerId: invoice?.customerId ?? "",
      issueDate: invoice?.issueDate ?? "",
      dueDate: invoice?.dueDate ?? "",
      status: invoice?.status ?? "draft",
      taxRate: String(invoice?.taxRate ?? 14),
      discount: String(invoice?.discount ?? 0),
      items: invoice?.items.map((item) => ({
        productId: item.productId,
        quantity: String(item.quantity),
      })) ?? [{ productId: "", quantity: "1" }],
    },
  })

  const { fields, append, remove } = useFieldArray({ control: form.control, name: "items" })
  const watched = useWatch({ control: form.control })

  const priceOf = (productId: string) =>
    products.find((product) => product.id === productId)?.price ?? 0

  const preview = invoiceTotals(
    (watched.items ?? []).map((item) => ({
      price: priceOf(item?.productId ?? ""),
      quantity: Number(item?.quantity) || 0,
    })),
    Number(watched.discount) || 0,
    Number(watched.taxRate) || 0,
  )

  function submit(values: FormValues) {
    const customer = customers.find((item) => item.id === values.customerId)

    const items = values.items.map((item) => {
      const product = products.find((entry) => entry.id === item.productId)

      return {
        productId: item.productId,
        name: product?.name ?? "",
        price: product?.price ?? 0,
        quantity: Number(item.quantity),
      }
    })

    const totals = invoiceTotals(items, Number(values.discount), Number(values.taxRate))

    onSave(
      {
        customerId: values.customerId,
        customerName: customer?.name ?? "",
        issueDate: values.issueDate.trim(),
        dueDate: values.dueDate.trim(),
        status: values.status,
        items,
        discount: Number(values.discount),
        taxRate: Number(values.taxRate),
        ...totals,
      },
      invoice?.id,
    )
    onClose()
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{invoice ? t("editInvoice") : t("newInvoice")}</DialogTitle>
          <DialogDescription>
            {invoice ? t("editInvoiceSubtitle") : t("newInvoiceSubtitle")}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(submit)} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="customerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("customer")}</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder={t("customer")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="max-h-72">
                        {customers.map((customer) => (
                          <SelectItem key={customer.id} value={customer.id}>
                            {customer.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("status")}</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="h-11">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {INVOICE_STATUSES.map((status) => (
                          <SelectItem key={status} value={status}>
                            {t(`invoiceStatus_${status}`)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="issueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("issueDate")}</FormLabel>
                    <FormControl>
                      <Input className="h-11" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("dueDate")}</FormLabel>
                    <FormControl>
                      <Input className="h-11" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="discount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("discount")}</FormLabel>
                    <FormControl>
                      <Input dir="ltr" inputMode="decimal" className="h-11" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="taxRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("taxRate")}</FormLabel>
                    <FormControl>
                      <Input dir="ltr" inputMode="decimal" className="h-11" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-3 rounded-xl border border-border/70 p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">{t("invoiceItems")}</p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ productId: "", quantity: "1" })}
                >
                  <Plus className="size-4" />
                  {t("addItem")}
                </Button>
              </div>

              {fields.map((item, index) => (
                <div key={item.id} className="flex items-start gap-2">
                  <FormField
                    control={form.control}
                    name={`items.${index}.productId`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <Select value={field.value} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger className="h-10">
                              <SelectValue placeholder={t("product")} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="max-h-72">
                            {products.map((product) => (
                              <SelectItem key={product.id} value={product.id}>
                                {product.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`items.${index}.quantity`}
                    render={({ field }) => (
                      <FormItem className="w-20">
                        <FormControl>
                          <Input dir="ltr" inputMode="numeric" className="h-10" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <span
                    dir="ltr"
                    className="h-10 w-24 shrink-0 pt-2.5 text-end text-sm tabular-nums text-muted-foreground"
                  >
                    {formatMoney(
                      priceOf(watched.items?.[index]?.productId ?? "") *
                        (Number(watched.items?.[index]?.quantity) || 0),
                    )}
                  </span>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label={t("delete")}
                    disabled={fields.length === 1}
                    className="mt-1 text-destructive hover:text-destructive"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ))}

              <div className="space-y-2 border-t border-border/70 pt-3">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{t("subtotal")}</span>
                  <span dir="ltr" className="tabular-nums">
                    {formatMoney(preview.subtotal)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{t("discount")}</span>
                  <span dir="ltr" className="tabular-nums">
                    −{formatMoney(Number(watched.discount) || 0)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{t("tax")}</span>
                  <span dir="ltr" className="tabular-nums">
                    {formatMoney(preview.tax)}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-sm font-medium">{t("total")}</span>
                  <span dir="ltr" className="text-lg font-semibold tabular-nums">
                    {formatMoney(preview.total)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                {t("cancel")}
              </Button>
              <Button
                type="submit"
                disabled={!form.formState.isValid}
                variant="gradient"
              >
                {invoice ? t("saveChanges") : t("newInvoice")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
