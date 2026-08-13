# Login

**Route:** `/login` · **Page:** `src/features/public/pages/LoginPage.tsx`

The entry point. Because there is no backend, sign-in matches the typed credentials against a fixed list of demo accounts.

## What the page does

- **Showcase panel** (`LoginShowcase`) on wide screens: Lottie animation, headline, three feature lines over a masked grid backdrop.
- **Company picker** — one card per demo account; picking one fills the form and clears any error.
- **Credentials form** — username and password. Both inputs are intentionally `disabled` and pre-filled, so the page demonstrates the flow without inviting typing. The password has a show/hide toggle.
- **Errors** — `invalidCredentials` and `planExpired` are shown as-is; anything else falls back to `signInFailed`.
- **Submit** — a gradient button with a shine sweep while it is enabled and a spinner while submitting.
- Language select and theme toggle sit in the corner, so the language can be chosen before signing in.

## Files

| File | Role |
| --- | --- |
| `pages/LoginPage.tsx` | Form, company picker, error handling, redirect. |
| `components/login/LoginShowcase.tsx` | The marketing panel. |
| `api/login.ts` | `signIn()`. |
| `data/accounts.ts` | The demo accounts. |
| `lib/session.ts` | `saveSession()` after a successful sign-in. |
| `types/login.ts` | `Credentials`, `AuthUser`, `SignInResponse`. |

## Sign-in flow

1. `signIn({ username, password })` waits 700 ms to imitate network latency.
2. It looks the account up case-insensitively and compares the password.
3. No match → throws `invalidCredentials`; expired plan → throws `planExpired`.
4. On success it returns `{ token, user }`, the page calls `saveSession()`, then navigates to `/dashboard` with `replace: true` so Back does not return to the login screen.

## Demo accounts

| Username | Password | Company | Plan |
| --- | --- | --- | --- |
| `volt` | `Volt2026` | Volt Home Appliances | Growth, expires 2027-12-31 |
| `aqua` | `Aqua2026` | AquaCare Sanitary | Starter, expires 2027-09-30 |

The company id (`volt` / `aqua`) is what every mock data path is built from — see [../data.md](../data.md).

## Validation

Zod: username 3–32 characters matching `^[a-zA-Z0-9._-]+$`; password ≥ 8 characters containing at least one letter and one digit. Validation runs `onChange` and the submit button stays disabled until it passes.

## Note

`LoginShowcase` loads its animation from an external `lottie.host` URL. Offline or behind a strict network, that request fails and the panel renders without the animation; nothing else on the page is affected.

## Translations

`signInTitle`, `signInSubtitle`, `username`, `password`, `signIn`, `signingIn`, `signInFailed`, `invalidCredentials`, `planExpired`, `showPassword`, `hidePassword`, `chooseCompany`, `noAccount`, `viewPlans`, `footerRights`, `loginHeadline`, `loginSubheadline`, `loginFeatureInsights`, `loginFeatureSpeed`, `loginFeatureSecurity`, plus the username/password validation keys.
