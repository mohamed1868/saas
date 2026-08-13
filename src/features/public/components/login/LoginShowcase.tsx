import { DotLottieReact } from "@lottiefiles/dotlottie-react"
import { ShieldCheck, Sparkles, Zap } from "lucide-react"
import type { CSSProperties } from "react"
import { useTranslation } from "react-i18next"

import logoDark from "@/assets/logo/logoDark.webp"
import { siteConfig } from "@/config/site"

const LOGIN_LOTTIE =
  "https://lottie.host/6cc0c417-fc5a-49b1-8f68-ecfbd8505d93/xE5y6JAnTf.json"

const FEATURES = [
  { key: "loginFeatureInsights", icon: Sparkles },
  { key: "loginFeatureSpeed", icon: Zap },
  { key: "loginFeatureSecurity", icon: ShieldCheck },
]

const GRID: CSSProperties = {
  backgroundImage:
    "linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)",
  backgroundSize: "56px 56px",
  maskImage: "radial-gradient(ellipse at 50% 40%, #000 10%, transparent 72%)",
  WebkitMaskImage: "radial-gradient(ellipse at 50% 40%, #000 10%, transparent 72%)",
}

export function LoginShowcase() {
  const { t } = useTranslation()

  return (
    <aside className="relative hidden overflow-hidden bg-[linear-gradient(160deg,#0B1739_0%,#081028_55%,#0A1330_100%)] p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-14">
      <div className="pointer-events-none absolute -top-28 -start-24 size-104 animate-aurora rounded-full bg-[#CB3CFF]/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -end-24 size-120 animate-aurora rounded-full bg-[#00C2FF]/20 blur-3xl [animation-delay:-9s]" />
      <div className="pointer-events-none absolute inset-0" style={GRID} />

      <img src={logoDark} alt={siteConfig.name} className="relative h-9 w-auto self-start" />

      <div className="relative flex flex-col items-center gap-8">
        <div className="w-full max-w-xs animate-float drop-shadow-[0_0_60px_rgba(203,60,255,0.35)]">
          <DotLottieReact src={LOGIN_LOTTIE} loop autoplay className="aspect-square w-full" />
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-3 space-y-3 text-center duration-700">
          <h2 className="text-3xl font-semibold text-balance">{t("loginHeadline")}</h2>
          <p className="mx-auto max-w-sm text-sm leading-relaxed text-white/60">
            {t("loginSubheadline")}
          </p>
        </div>

        <ul className="grid w-full max-w-sm gap-2.5">
          {FEATURES.map(({ key, icon: Icon }, index) => (
            <li
              key={key}
              style={{ animationDelay: `${200 + index * 130}ms` }}
              className="animate-in fade-in slide-in-from-bottom-3 fill-mode-backwards flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/85 backdrop-blur-sm duration-700"
            >
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/10 text-[#CB3CFF]">
                <Icon className="size-4" />
              </span>
              {t(key)}
            </li>
          ))}
        </ul>
      </div>

      <p className="relative text-center text-xs text-white/40">
        {t("footerRights", { year: new Date().getFullYear() })}
      </p>
    </aside>
  )
}
