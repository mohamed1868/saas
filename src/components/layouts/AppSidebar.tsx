import { BarChart3, LayoutDashboard, Package, Settings } from "lucide-react"
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
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { LANGUAGES } from "@/lib/i18n"
import { PATHS } from "@/app/router/paths"

const NAV = [
  { to: PATHS.dashboard, key: "dashboard", icon: LayoutDashboard },
  { to: PATHS.reports, key: "reports", icon: BarChart3 },
  { to: PATHS.products, key: "products", icon: Package },
  { to: PATHS.settings, key: "settings", icon: Settings },
]

export function AppSidebar() {
  const { t, i18n } = useTranslation()
  const { pathname } = useLocation()

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
              {NAV.map(({ to, key, icon: Icon }) => (
                <SidebarMenuItem key={to}>
                  <SidebarMenuButton asChild isActive={pathname === to} tooltip={t(key)}>
                    <NavLink to={to}>
                      <Icon />
                      <span>{t(key)}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
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
