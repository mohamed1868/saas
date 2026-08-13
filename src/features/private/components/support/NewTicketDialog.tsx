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
  TICKET_CATEGORIES,
  TICKET_PRIORITIES,
  type TicketCategory,
  type TicketPriority,
} from "@/features/private/types/support"

function buildSchema(t: (key: string) => string) {
  return z.object({
    subject: z.string().trim().min(5, t("subjectRequired")),
    category: z.enum(TICKET_CATEGORIES),
    priority: z.enum(TICKET_PRIORITIES),
    message: z.string().trim().min(10, t("messageRequired")),
  })
}

type FormValues = z.infer<ReturnType<typeof buildSchema>>

type NewTicketDialogProps = {
  onSubmit: (values: {
    subject: string
    category: TicketCategory
    priority: TicketPriority
    message: string
  }) => void
  onClose: () => void
}

export function NewTicketDialog({ onSubmit, onClose }: NewTicketDialogProps) {
  const { t } = useTranslation()
  const schema = useMemo(() => buildSchema(t), [t])

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: { subject: "", category: "technical", priority: "medium", message: "" },
  })

  function submit(values: FormValues) {
    onSubmit({
      subject: values.subject.trim(),
      category: values.category,
      priority: values.priority,
      message: values.message.trim(),
    })
    onClose()
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t("newTicket")}</DialogTitle>
          <DialogDescription>{t("newTicketSubtitle")}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(submit)} className="space-y-4">
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("subject")}</FormLabel>
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
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("category")}</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="h-11">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {TICKET_CATEGORIES.map((category) => (
                          <SelectItem key={category} value={category}>
                            {t(`ticketCategory_${category}`)}
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
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("priority")}</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="h-11">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {TICKET_PRIORITIES.map((priority) => (
                          <SelectItem key={priority} value={priority}>
                            {t(`ticketPriority_${priority}`)}
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
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("message")}</FormLabel>
                  <FormControl>
                    <textarea
                      rows={5}
                      className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 dark:bg-input/30"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                {t("cancel")}
              </Button>
              <Button
                type="submit"
                disabled={!form.formState.isValid}
                variant="gradient"
              >
                {t("sendTicket")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
