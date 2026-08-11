import { zodResolver } from "@hookform/resolvers/zod"
import { useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { signIn } from "@/features/auth/api/login"
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

export default function LoginPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)

  const schema = useMemo(() => buildSchema(t), [t])
  const form = useForm<LoginValues>({
    resolver: zodResolver(schema),
    defaultValues: { username: "", password: "" },
  })

  async function login(values: LoginValues) {
    setError(null)

    try {
      const { token, user } = await signIn(values)
      localStorage.setItem("token", token)
      localStorage.setItem("user", JSON.stringify(user))
      navigate(PATHS.dashboard, { replace: true })
    } catch {
      setError("signInFailed")
    }
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-background p-6">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>{t("signInTitle")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(login)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("username")}</FormLabel>
                    <FormControl>
                      <Input autoComplete="username" {...field} />
                    </FormControl>
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
                    <FormControl>
                      <Input type="password" autoComplete="current-password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {error && <p className="text-sm text-destructive">{t(error)}</p>}

              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? t("signingIn") : t("signIn")}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
