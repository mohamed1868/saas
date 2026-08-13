import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowRight, Building2, Check, CircleAlert, Eye, EyeOff, Loader2, Lock, User } from "lucide-react"
import { useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { Link, useNavigate } from "react-router-dom"
import { z } from "zod"

import logoDark from "@/assets/logo/logoDark.webp"
import logoLight from "@/assets/logo/logoLight.webp"
import { LanguageSelect } from "@/components/shared/LanguageSelect"
import { ModeToggle } from "@/components/shared/ModeToggle"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { siteConfig } from "@/config/site"
import { signIn } from "@/features/public/api/login"
import { LoginShowcase } from "@/features/public/components/login/LoginShowcase"
import { ACCOUNTS, type Account } from "@/features/public/data/accounts"
import { saveSession } from "@/features/public/lib/session"
import { cn } from "@/lib/utils"
import { PATHS } from "@/app/router/paths"

const USERNAME = /^[a-zA-Z0-9._-]+$/

function buildSchema(t: (key: string) => string) {
  return z.object({
    username: z
      .string()
      .trim()
      .min(3, t("usernameTooShort"))
      .max(32, t("usernameTooLong"))
      .regex(USERNAME, t("usernameInvalid")),
    password: z
      .string()
      .min(8, t("passwordTooShort"))
      .regex(/[A-Za-z]/, t("passwordNeedsLetter"))
      .regex(/[0-9]/, t("passwordNeedsNumber")),
  })
}

type LoginValues = z.infer<ReturnType<typeof buildSchema>>

const ERRORS = ["invalidCredentials", "planExpired"]

export default function LoginPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [selected, setSelected] = useState(ACCOUNTS[0].username)

  const schema = useMemo(() => buildSchema(t), [t])
  const form = useForm<LoginValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: { username: ACCOUNTS[0].username, password: ACCOUNTS[0].password },
  })

  const { isSubmitting, isValid } = form.formState
  const canSubmit = isValid && !isSubmitting

  function selectAccount(account: Account) {
    setSelected(account.username)
    setError(null)
    setRevealed(false)
    form.setValue("username", account.username, { shouldValidate: true })
    form.setValue("password", account.password, { shouldValidate: true })
  }

  async function login(values: LoginValues) {
    setError(null)

    try {
      const { token, user } = await signIn(values)
      saveSession(token, user)
      navigate(PATHS.dashboard, { replace: true })
    } catch (cause) {
      const key = cause instanceof Error ? cause.message : ""
      setError(ERRORS.includes(key) ? key : "signInFailed")
    }
  }

  return (
    <div className="min-h-svh lg:grid lg:grid-cols-[1.05fr_1fr]">
      <LoginShowcase />

      <main className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden p-5 sm:p-8 lg:min-h-0">
        <div className="pointer-events-none absolute -top-40 left-1/2 size-136 -translate-x-1/2 animate-aurora rounded-full bg-primary/15 blur-3xl lg:hidden" />

        <div className="absolute top-4 end-4 z-20 flex items-center gap-2">
          <LanguageSelect />
          <ModeToggle />
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-4 relative z-10 w-full max-w-md duration-700">
          <Card className="border-border/60 bg-card/80 shadow-2xl shadow-primary/5 backdrop-blur-xl">
            <CardHeader className="space-y-4 p-6 pb-4 sm:p-8 sm:pb-5">
              <div className="flex items-center gap-3">
                <img src={logoLight} alt={siteConfig.name} className="h-8 w-auto dark:hidden" />
                <img src={logoDark} alt={siteConfig.name} className="hidden h-8 w-auto dark:block" />
              </div>

              <div className="space-y-1.5">
                <CardTitle className="text-2xl">{t("signInTitle")}</CardTitle>
                <CardDescription>{t("signInSubtitle")}</CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-5 p-6 pt-0 sm:p-8 sm:pt-0">
              <div className="space-y-2">
                <p className="text-sm font-medium">{t("chooseCompany")}</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {ACCOUNTS.map((account) => {
                    const active = account.username === selected

                    return (
                      <button
                        key={account.username}
                        type="button"
                        onClick={() => selectAccount(account)}
                        className={cn(
                          "rounded-xl border p-3 text-start transition-colors",
                          active
                            ? "border-primary bg-primary/10"
                            : "border-border hover:bg-accent/50",
                        )}
                      >
                        <span className="flex items-center gap-2">
                          {active ? (
                            <Check className="size-4 shrink-0 text-primary" />
                          ) : (
                            <Building2 className="size-4 shrink-0 text-muted-foreground" />
                          )}
                          <span className="truncate text-sm font-medium">
                            {account.user.company.name}
                          </span>
                        </span>
                        <span className="mt-1 block text-xs text-muted-foreground">
                          {t(account.user.company.industryKey)}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(login)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("username")}</FormLabel>
                        <div className="relative">
                          <User className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                          <FormControl>
                            <Input
                              disabled
                              autoComplete="username"
                              className="h-11 ps-9 disabled:bg-muted/40 disabled:opacity-100"
                              {...field}
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("password")}</FormLabel>
                        <div className="relative">
                          <Lock className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                          <FormControl>
                            <Input
                              disabled
                              type={revealed ? "text" : "password"}
                              autoComplete="current-password"
                              className="h-11 px-9 disabled:bg-muted/40 disabled:opacity-100"
                              {...field}
                            />
                          </FormControl>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            aria-label={t(revealed ? "hidePassword" : "showPassword")}
                            className="absolute end-1.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                            onClick={() => setRevealed((shown) => !shown)}
                          >
                            {revealed ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {error && (
                    <p
                      role="alert"
                      className="animate-in fade-in slide-in-from-top-1 flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"
                    >
                      <CircleAlert className="mt-0.5 size-4 shrink-0" />
                      {t(error)}
                    </p>
                  )}

                  <Button
                    type="submit"
                    size="lg"
                    disabled={!canSubmit}
                    variant="gradient"
                    className="relative w-full overflow-hidden shadow-lg shadow-primary/25 transition-all active:scale-[0.99] disabled:shadow-none"
                  >
                    {canSubmit && (
                      <span className="pointer-events-none absolute inset-y-0 start-0 w-1/4 animate-shine bg-white/25 blur-md" />
                    )}
                    {isSubmitting ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        {t("signingIn")}
                      </>
                    ) : (
                      <>
                        {t("signIn")}
                        <ArrowRight className="size-4 rtl:rotate-180" />
                      </>
                    )}
                  </Button>
                </form>
              </Form>

              <p className="text-center text-sm text-muted-foreground">
                {t("noAccount")}{" "}
                <Link to={PATHS.plans} className="font-medium text-primary hover:underline">
                  {t("viewPlans")}
                </Link>
              </p>
            </CardContent>
          </Card>

          <p className="mt-6 text-center text-xs text-muted-foreground lg:hidden">
            {t("footerRights", { year: new Date().getFullYear() })}
          </p>
        </div>
      </main>
    </div>
  )
}
