import { zodResolver } from "@hookform/resolvers/zod"
import { CircleAlert, CircleCheck, Loader2, Send } from "lucide-react"
import { useMemo, useState } from "react"
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
import { requestPlan } from "@/features/public/plans/api/planRequest"
import type { Plan } from "@/features/public/plans/types/plans"

const PHONE = /^[+0-9\s()-]{8,20}$/

function buildSchema(t: (key: string) => string) {
  return z.object({
    company: z.string().trim().min(2, t("companyRequired")),
    name: z.string().trim().min(2, t("nameRequired")),
    email: z.email(t("emailInvalid")),
    phone: z.string().trim().regex(PHONE, t("phoneInvalid")),
    message: z.string().trim().max(500).optional(),
  })
}

type RequestValues = z.infer<ReturnType<typeof buildSchema>>

export function PlanRequestDialog({
  plan,
  onOpenChange,
}: {
  plan: Plan | null
  onOpenChange: (open: boolean) => void
}) {
  const { t } = useTranslation()
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)
  const [openedPlanId, setOpenedPlanId] = useState<string | null>(null)

  const schema = useMemo(() => buildSchema(t), [t])
  const form = useForm<RequestValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: { company: "", name: "", email: "", phone: "", message: "" },
  })

  if (plan && plan.id !== openedPlanId) {
    setOpenedPlanId(plan.id)
    setSent(false)
    setError(null)
  }

  function handleOpenChange(open: boolean) {
    if (!open) setOpenedPlanId(null)
    onOpenChange(open)
  }

  async function submit(values: RequestValues) {
    if (!plan) return
    setError(null)

    try {
      await requestPlan({ ...values, planId: plan.id })
      setSent(true)
    } catch (cause) {
      const key = cause instanceof Error ? cause.message : ""
      setError(key === "missingFormKey" ? "missingFormKey" : "requestFailed")
    }
  }

  return (
    <Dialog open={Boolean(plan)} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{sent ? t("requestSent") : t("requestPlanTitle")}</DialogTitle>
          <DialogDescription>
            {sent
              ? t("requestSentBody")
              : t("requestPlanSubtitle", { plan: plan?.name ?? "" })}
          </DialogDescription>
        </DialogHeader>

        {sent ? (
          <div className="flex flex-col items-center gap-4 py-4">
            <span className="flex size-14 items-center justify-center rounded-full bg-chart-4/15 text-chart-4">
              <CircleCheck className="size-7" />
            </span>
            <Button onClick={() => onOpenChange(false)} className="w-full">
              {t("close")}
            </Button>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(submit)} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("companyName")}</FormLabel>
                      <FormControl>
                        <Input className="h-11" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("contactName")}</FormLabel>
                      <FormControl>
                        <Input className="h-11" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
              </div>

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("message")}</FormLabel>
                    <FormControl>
                      <textarea
                        rows={3}
                        className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 dark:bg-input/30"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {error && (
                <p
                  role="alert"
                  className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"
                >
                  <CircleAlert className="mt-0.5 size-4 shrink-0" />
                  {t(error)}
                </p>
              )}

              <Button
                type="submit"
                size="lg"
                disabled={!form.formState.isValid || form.formState.isSubmitting}
                className="w-full bg-linear-to-r from-primary to-chart-3 text-white hover:brightness-110"
              >
                {form.formState.isSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    {t("sending")}
                  </>
                ) : (
                  <>
                    <Send className="size-4 rtl:-scale-x-100" />
                    {t("sendRequest")}
                  </>
                )}
              </Button>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  )
}
