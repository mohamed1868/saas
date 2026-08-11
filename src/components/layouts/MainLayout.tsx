import { Outlet } from "react-router-dom"

import { AppSidebar } from "@/components/layouts/AppSidebar"
import { Header } from "@/components/layouts/Header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export default function MainLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
