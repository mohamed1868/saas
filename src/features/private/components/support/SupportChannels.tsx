import { Mail, MessageCircle, Phone } from "lucide-react"
import { useTranslation } from "react-i18next"

import { Card } from "@/components/ui/card"
import { siteConfig } from "@/config/site"

export function SupportChannels() {
  const { t } = useTranslation()

  const subject = encodeURIComponent(t("emailSubject", { name: siteConfig.name }))
  const message = encodeURIComponent(t("whatsappMessage", { name: siteConfig.name }))

  const channels = [
    {
      key: "email",
      icon: Mail,
      label: t("emailUs"),
      value: siteConfig.support.email,
      href: `mailto:${siteConfig.support.email}?subject=${subject}`,
      tone: "bg-chart-2/15 text-chart-2",
    },
    {
      key: "phone",
      icon: Phone,
      label: t("callUs"),
      value: siteConfig.support.phone,
      href: `tel:${siteConfig.support.phone.replace(/\s/g, "")}`,
      tone: "bg-chart-3/15 text-chart-3",
    },
    {
      key: "whatsapp",
      icon: MessageCircle,
      label: t("whatsapp"),
      value: siteConfig.support.phone,
      href: `https://wa.me/${siteConfig.support.whatsapp}?text=${message}`,
      tone: "bg-chart-4/15 text-chart-4",
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {channels.map((channel) => (
        <Card key={channel.key} className="rounded-xl border-border/70 p-4">
          <a
            href={channel.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3"
          >
            <span
              className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${channel.tone}`}
            >
              <channel.icon className="size-5" />
            </span>

            <span className="min-w-0">
              <span className="block text-sm font-medium">{channel.label}</span>
              <span dir="ltr" className="block truncate text-start text-xs text-muted-foreground">
                {channel.value}
              </span>
            </span>
          </a>
        </Card>
      ))}
    </div>
  )
}
