# Plans

**Route:** `/plans` · **Page:** `src/features/public/pages/PlansPage.tsx`

The public pricing page, linked from the login screen. Visitors pick a plan and leave their details; the request is emailed through Web3Forms.

## What the page does

- Header with the logo, language select, theme toggle and a back-to-login button.
- Title and subtitle over an animated aurora backdrop.
- **Three plan cards**; the featured one gets a "most popular" ribbon, a primary border and a gradient button.
- **Loading** renders three card-shaped skeletons; **failure** shows the error with a retry button.
- Choosing a plan opens the **request dialog**.

## Files

| File | Role |
| --- | --- |
| `pages/PlansPage.tsx` | Loads the plans, holds loading/error state, opens the dialog. |
| `components/plans/PlanCard.tsx` | One plan: name, price, description, feature list, CTA. |
| `components/plans/PlanRequestDialog.tsx` | The request form and its sending/success/failure states. |
| `api/plans.ts` | `getPlans()`. |
| `api/planRequest.ts` | `requestPlan()`. |
| `types/plans.ts` | `Plan`, `PlanRequest`. |

## Data model

```ts
type Plan = {
  id: string
  name: string
  description: string
  price: string       // pre-formatted per language
  features: string[]
  featured?: boolean
}
```

Plans are the only mock resource **not** scoped to a company — `getPlans()` requests `/plans`, which the interceptor turns into `/mock/{lang}/plans.json`.

## The request form

`requestPlan()` posts to `https://api.web3forms.com/submit`:

- Non-OK response or `success: false` → throws `requestFailed`, shown as an inline alert.
- Success → the dialog swaps to a confirmation state.

The access key is a constant in `api/planRequest.ts`, not an environment variable. Web3Forms keys are meant to be embedded in client-side forms, so the key is readable in the deployed bundle either way; hard-coding it means the form works on any deployment with no dashboard configuration. The trade-off is that the key also lives in git history — if the form starts collecting spam, rotate it in the Web3Forms dashboard and update the constant.

The subject and sender name are built from `siteConfig.name`, and an empty message is sent as `—` so the email always has a body.

Validated fields: company name, contact name, a valid email, a phone matching the shared phone pattern, and an optional message.

## Translations

`plansTitle`, `plansSubtitle`, `plansFooterNote`, `plansLoadFailed`, `backToLogin`, `perMonth`, `choosePlan`, `mostPopular`, `requestPlanTitle`, `requestPlanSubtitle`, `requestSent`, `requestSentBody`, `requestFailed`, `companyName`, `contactName`, `email`, `phone`, `message`, `sendRequest`, `sending`, `close`, plus `companyRequired`, `nameRequired`, `emailInvalid`, `phoneInvalid`.

## Mock data

`public/mock/{en,ar}/plans.json`.
