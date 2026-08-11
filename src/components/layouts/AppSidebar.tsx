import {
  LayoutDashboard,
  Package,
  ReceiptText,
  Settings,
  ShoppingCart,
  UsersRound,
  Wallet,
} from "lucide-react"
import { useTranslation } from "react-i18next"
import { NavLink, useLocation } from "react-router-dom"

import logoDark from "@/assets/logo/logoDark.webp"
import logoLight from "@/assets/logo/logoLight.webp"
import { NavUser } from "@/components/layouts/NavUser"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { daysLeft, getSession } from "@/features/public/login/lib/session"
import { LANGUAGES } from "@/lib/i18n"
import { PATHS } from "@/app/router/paths"

const NAV = [
  { key: "dashboard", icon: LayoutDashboard, to: PATHS.dashboard },
  { key: "products", icon: Package },
  { key: "customers", icon: UsersRound },
  { key: "orders", icon: ShoppingCart },
  { key: "invoices", icon: ReceiptText },
  { key: "finance", icon: Wallet },
  { key: "settings", icon: Settings },
]

export function AppSidebar() {
  const { t, i18n } = useTranslation()
  const { pathname } = useLocation()
  const session = getSession()

  const rtl = LANGUAGES.find((l) => l.code === i18n.language)?.dir === "rtl"

  return (
    <Sidebar collapsible="icon" side={rtl ? "right" : "left"}>
      <SidebarHeader className="p-4 group-data-[collapsible=icon]:p-2">
        <img
          src={logoLight}
          alt="FluxSync"
          className="h-8 w-auto dark:hidden group-data-[collapsible=icon]:hidden"
        />
        <img
          src={logoDark}
          alt="FluxSync"
          className="hidden h-8 w-auto dark:block group-data-[collapsible=icon]:!hidden"
        />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV.map(({ key, icon: Icon, to }) => (
                <SidebarMenuItem key={key}>
                  {to ? (
                    <SidebarMenuButton asChild isActive={pathname === to} tooltip={t(key)}>
                      <NavLink to={to}>
                        <Icon />
                        <span>{t(key)}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  ) : (
                    <>
                      <SidebarMenuButton disabled tooltip={t("soon")} className="opacity-50">
                        <Icon />
                        <span>{t(key)}</span>
                      </SidebarMenuButton>
                      <SidebarMenuBadge className="text-[10px] text-muted-foreground group-data-[collapsible=icon]:hidden">
                        {t("soon")}
                      </SidebarMenuBadge>
                    </>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        {session && (
          <div className="rounded-xl border border-sidebar-border bg-sidebar-accent/40 p-3 group-data-[collapsible=icon]:hidden">
            <p className="truncate text-sm font-medium">{session.company.name}</p>
            <p className="truncate text-xs text-muted-foreground">
              {t(session.company.industryKey)}
            </p>

            <div className="mt-2.5 flex items-center justify-between gap-2">
              <span className="rounded-full bg-primary/15 px-2 py-0.5 text-xs font-medium text-primary">
                {t(session.plan.nameKey)}
              </span>
              <span className="text-xs text-muted-foreground">
                {t("daysLeft", { days: daysLeft(session.plan) })}
              </span>
            </div>
          </div>
        )}

        <SidebarMenu>
          <SidebarMenuItem>
            <NavUser />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
