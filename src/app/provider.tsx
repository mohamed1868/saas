import { Provider } from "react-redux"
import { PersistGate } from "redux-persist/integration/react"

import { PageFallback } from "@/components/shared/PageFallback"
import { ThemeProvider } from "@/components/theme-provider"
import { persistor, store } from "@/store"

export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={<PageFallback />} persistor={persistor}>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          {children}
        </ThemeProvider>
      </PersistGate>
    </Provider>
  )
}
