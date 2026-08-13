# Account

**Route:** `/dashboard/account` · **Page:** `src/features/private/pages/AccountPage.tsx`

The signed-in user's profile, company details, subscription state and device preferences. Reached from the user menu in the sidebar.

## What the page does

- **Profile card** — gradient avatar with initials, name, email and the plan badge.
- **Account details** — username, email, company name and industry, each with an icon. The email is forced to `dir="ltr"` so it reads correctly in Arabic.
- **Subscription** — expiry date formatted with `Intl.DateTimeFormat` in the active language, days remaining, and a progress bar scaled against a 365-day year.
- **Preferences** — the language select and theme toggle, with a note that both are stored per device.
- **Session** — a logout button that clears the session and redirects to `/login`.

## Files

| File | Role |
| --- | --- |
| `pages/AccountPage.tsx` | The whole page — no sub-components. |
| `features/public/lib/session.ts` | `getSession()`, `daysLeft()`, `clearSession()`. |
| `components/shared/LanguageSelect.tsx` | Language switcher. |
| `components/shared/ModeToggle.tsx` | Theme toggle. |

## Data

Everything comes from `getSession()` — there is no fetch and no slice. The page returns `null` when there is no session, though `ProtectedRoute` normally prevents that from happening.

The details array is built inline so each row renders through one loop:

```ts
const details = [
  { key: "username", icon: User, value: session.name },
  { key: "email", icon: Mail, value: session.email, ltr: true },
  { key: "companyName", icon: Building2, value: session.company.name },
  { key: "industry", icon: ShieldCheck, value: t(session.company.industryKey) },
]
```

`industryKey` is a translation key (`industryAppliances`, `industrySanitary`), not display text — the same trick keeps the plan name (`planStarter`, `planGrowth`) translatable.

## Translations

`account`, `accountSubtitle`, `accountDetails`, `username`, `email`, `companyName`, `industry`, `subscription`, `expiresOn`, `daysLeft`, `subscriptionNote`, `preferences`, `preferencesNote`, `session`, `sessionNote`, `logout`, plus `industryAppliances`, `industrySanitary`, `planStarter`, `planGrowth`.
