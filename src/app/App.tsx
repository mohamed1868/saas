import { RouterProvider } from "react-router-dom"

import { AppProvider } from "@/app/provider"
import { router } from "@/app/router"

export default function App() {
  return (
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>
  )
}
