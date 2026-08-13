import i18n from "i18next"
import HttpBackend from "i18next-http-backend"
import { initReactI18next } from "react-i18next"

export const LANGUAGES = [
  { code: "en", label: "English", dir: "ltr" },
  { code: "ar", label: "العربية", dir: "rtl" },
] as const

function applyDirection(code: string) {
  const language = LANGUAGES.find((l) => l.code === code) ?? LANGUAGES[0]
  document.documentElement.lang = language.code
  document.documentElement.dir = language.dir
}

const saved = localStorage.getItem("lang") ?? "en"

i18n
  .use(HttpBackend)
  .use(initReactI18next)
  .init({
    lng: saved,
    fallbackLng: "en",
    supportedLngs: LANGUAGES.map((l) => l.code),
    keySeparator: false,
    backend: { loadPath: "/locales/{{lng}}.json" },
    interpolation: { escapeValue: false },
  })

applyDirection(saved)

export default i18n
