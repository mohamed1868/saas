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
  ORDER_STATUSES,
  PAYMENT_STATUSES,
  type Order,
  type OrderDraft,
} from "@/features/private/types/orders"
import type { Product } from "@/features/private/types/products"
import { formatMoney } from "@/lib/utils"

function buildSchema(t: (key: string) => string) {
  return z.object({
    customerId: z.string().min(1, t("customerRequired")),
    date: z.string().trim().min(3, t("dateRequired")),
    status: z.enum(ORDER_STATUSES),
    payment: z.enum(PAYMENT_STATUSES),
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

type OrderFormDialogProps = {
  order: Order | null
  customers: Customer[]
  products: Product[]
  onSave: (draft: Omit<OrderDraft, "number">, id?: string) => void
  onClose: () => void
}

export function OrderFormDialog({
  order,
  customers,
  products,
  onSave,
  onClose,
}: OrderFormDialogProps) {
  const { t } = useTranslation()
  const schema = useMemo(() => buildSchema(t), [t])

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      customerId: order?.customerId ?? "",
      date: order?.date ?? "",
      status: order?.status ?? "pending",
      payment: order?.payment ?? "unpaid",
      items: order?.items.map((item) => ({
        productId: item.productId,
        quantity: String(item.quantity),
      })) ?? [{ productId: "", quantity: "1" }],
    },
  })

  const { fields, append, remove } = useFieldArray({ control: form.control, name: "items" })
  const watchedItems = useWatch({ control: form.control, name: "items" })

  const priceOf = (productId: string) =>
    products.find((product) => product.id === productId)?.price ?? 0

  const total = (watchedItems ?? []).reduce(
    (sum, item) => sum + priceOf(item.productId) * (Number(item.quantity) || 0),
    0,
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

    onSave(
      {
        customerId: values.customerId,
        customerName: customer?.name ?? "",
        date: values.date.trim(),
        status: values.status,
        payment: values.payment,
        items,
        total: Number(items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)),
      },
      order?.id,
    )
    onClose()
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{order ? t("editOrder") : t("addOrder")}</DialogTitle>
          <DialogDescription>
            {order ? t("editOrderSubtitle") : t("addOrderSubtitle")}
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
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("date")}</FormLabel>
                    <FormControl>
                      <Input className="h-11" {...field} />
                    </FormControl>
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
                        {ORDER_STATUSES.map((status) => (
                          <SelectItem key={status} value={status}>
                            {t(`orderStatus_${status}`)}
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
                name="payment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("payment")}</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="h-11">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {PAYMENT_STATUSES.map((payment) => (
                          <SelectItem key={payment} value={payment}>
                            {t(`payment_${payment}`)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-3 rounded-xl border border-border/70 p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">{t("orderItems")}</p>
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
                      priceOf(watchedItems?.[index]?.productId ?? "") *
                        (Number(watchedItems?.[index]?.quantity) || 0),
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

              <div className="flex items-center justify-between border-t border-border/70 pt-3">
                <span className="text-sm text-muted-foreground">{t("total")}</span>
                <span dir="ltr" className="text-lg font-semibold tabular-nums">
                  {formatMoney(total)}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                {t("cancel")}
              </Button>
              <Button
                type="submit"
                disabled={!form.formState.isValid}
                className="bg-linear-to-r from-primary to-chart-3 text-white hover:brightness-110"
              >
                {order ? t("saveChanges") : t("addOrder")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
