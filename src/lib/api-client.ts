import axios from "axios"

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === "true"

export const api = axios.create({
  baseURL: USE_MOCKS ? "/mock" : import.meta.env.VITE_API_URL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) config.headers.Authorization = `Bearer ${token}`

  const lang = localStorage.getItem("lang") ?? "en"
  config.headers["Accept-Language"] = lang

  if (USE_MOCKS) {
    config.method = "get"
    config.data = undefined
    const path = (config.url ?? "").replace(/\/+$/, "")
    if (!path.endsWith(".json")) config.url = `/${lang}${path}.json`
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) localStorage.removeItem("token")
    return Promise.reject(error)
  },
)
