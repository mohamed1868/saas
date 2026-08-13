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
  PRODUCT_STATUSES,
  type Product,
  type ProductDraft,
} from "@/features/private/types/products"

function buildSchema(t: (key: string) => string) {
  return z.object({
    name: z.string().trim().min(2, t("nameRequired")),
    sku: z.string().trim().min(3, t("skuRequired")),
    category: z.string().trim().min(2, t("categoryRequired")),
    price: z.string().regex(/^\d+(\.\d{1,2})?$/, t("priceInvalid")),
    stock: z.string().regex(/^\d+$/, t("stockInvalid")),
    status: z.enum(PRODUCT_STATUSES),
  })
}

type FormValues = z.infer<ReturnType<typeof buildSchema>>

type ProductFormDialogProps = {
  product: Product | null
  categories: string[]
  onSave: (draft: ProductDraft, id?: string) => void
  onClose: () => void
}

export function ProductFormDialog({
  product,
  categories,
  onSave,
  onClose,
}: ProductFormDialogProps) {
  const { t } = useTranslation()
  const schema = useMemo(() => buildSchema(t), [t])

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      name: product?.name ?? "",
      sku: product?.sku ?? "",
      category: product?.category ?? categories[0] ?? "",
      price: product ? String(product.price) : "",
      stock: product ? String(product.stock) : "",
      status: product?.status ?? "active",
    },
  })

  function submit(values: FormValues) {
    onSave(
      {
        name: values.name.trim(),
        sku: values.sku.trim().toUpperCase(),
        category: values.category.trim(),
        price: Number(values.price),
        stock: Number(values.stock),
        status: values.status,
      },
      product?.id,
    )
    onClose()
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{product ? t("editProduct") : t("addProduct")}</DialogTitle>
          <DialogDescription>
            {product ? t("editProductSubtitle") : t("addProductSubtitle")}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(submit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("productName")}</FormLabel>
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
                name="sku"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("sku")}</FormLabel>
                    <FormControl>
                      <Input dir="ltr" className="h-11 font-mono" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("category")}</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder={t("category")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="max-h-72">
                        {categories.map((item) => (
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
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("price")}</FormLabel>
                    <FormControl>
                      <Input dir="ltr" inputMode="decimal" className="h-11" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("stock")}</FormLabel>
                    <FormControl>
                      <Input dir="ltr" inputMode="numeric" className="h-11" {...field} />
                    </FormControl>
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
                      {PRODUCT_STATUSES.map((item) => (
                        <SelectItem key={item} value={item}>
                          {t(`status_${item}`)}
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
                {product ? t("saveChanges") : t("addProduct")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
