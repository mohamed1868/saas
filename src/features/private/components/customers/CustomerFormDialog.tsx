import { zodResolver } from "@hookform/resolvers/zod"
import { useMemo } from "react"
import { useForm } from "react-hook-form"
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
import {
  CUSTOMER_STATUSES,
  CUSTOMER_TYPES,
  type Customer,
  type CustomerDraft,
} from "@/features/private/types/customers"

const PHONE = /^[+0-9\s()-]{8,20}$/

function buildSchema(t: (key: string) => string) {
  return z.object({
    name: z.string().trim().min(2, t("nameRequired")),
    email: z.email(t("emailInvalid")),
    phone: z.string().trim().regex(PHONE, t("phoneInvalid")),
    city: z.string().trim().min(2, t("cityRequired")),
    type: z.enum(CUSTOMER_TYPES),
    status: z.enum(CUSTOMER_STATUSES),
  })
}

type FormValues = z.infer<ReturnType<typeof buildSchema>>

type CustomerFormDialogProps = {
  customer: Customer | null
  cities: string[]
  onSave: (draft: CustomerDraft, id?: string) => void
  onClose: () => void
}

export function CustomerFormDialog({
  customer,
  cities,
  onSave,
  onClose,
}: CustomerFormDialogProps) {
  const { t } = useTranslation()
  const schema = useMemo(() => buildSchema(t), [t])

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      name: customer?.name ?? "",
      email: customer?.email ?? "",
      phone: customer?.phone ?? "",
      city: customer?.city ?? cities[0] ?? "",
      type: customer?.type ?? "retail",
      status: customer?.status ?? "active",
    },
  })

  function submit(values: FormValues) {
    onSave(
      {
        name: values.name.trim(),
        email: values.email.trim(),
        phone: values.phone.trim(),
        city: values.city.trim(),
        type: values.type,
        status: values.status,
        orders: customer?.orders ?? 0,
        totalSpent: customer?.totalSpent ?? 0,
      },
      customer?.id,
    )
    onClose()
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{customer ? t("editCustomer") : t("addCustomer")}</DialogTitle>
          <DialogDescription>
            {customer ? t("editCustomerSubtitle") : t("addCustomerSubtitle")}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(submit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("customerName")}</FormLabel>
                  <FormControl>
                    <Input className="h-11" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("email")}</FormLabel>
                    <FormControl>
                      <Input dir="ltr" type="email" className="h-11" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("phone")}</FormLabel>
                    <FormControl>
                      <Input dir="ltr" type="tel" className="h-11" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("city")}</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder={t("city")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="max-h-72">
                        {cities.map((item) => (
                          <SelectItem key={item} value={item}>
                            {item}
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
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("customerType")}</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="h-11">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CUSTOMER_TYPES.map((item) => (
                          <SelectItem key={item} value={item}>
                            {t(`customerType_${item}`)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
                      {CUSTOMER_STATUSES.map((item) => (
                        <SelectItem key={item} value={item}>
                          {t(`customerStatus_${item}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={onClose}>
                {t("cancel")}
              </Button>
              <Button
                type="submit"
                disabled={!form.formState.isValid}
                variant="gradient"
              >
                {customer ? t("saveChanges") : t("addCustomer")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
