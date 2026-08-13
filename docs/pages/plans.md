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

`requestPlan()` posts to `https://api.web3forms.com/submit` with the access key from `VITE_WEB3FORMS_KEY`:

- Missing key → throws `missingFormKey`, and the dialog tells the user to add it to `.env`.
- Non-OK response or `success: false` → throws `requestFailed`.
- Success → the dialog swaps to a confirmation state.

The subject and sender name are built from `siteConfig.name`, and an empty message is sent as `—` so the email always has a body.

Validated fields: company name, contact name, a valid email, a phone matching the shared phone pattern, and an optional message.

## Translations

`plansTitle`, `plansSubtitle`, `plansFooterNote`, `plansLoadFailed`, `backToLogin`, `perMonth`, `choosePlan`, `mostPopular`, `requestPlanTitle`, `requestPlanSubtitle`, `requestSent`, `requestSentBody`, `requestFailed`, `missingFormKey`, `companyName`, `contactName`, `email`, `phone`, `message`, `sendRequest`, `sending`, `close`, plus `companyRequired`, `nameRequired`, `emailInvalid`, `phoneInvalid`.

## Mock data

`public/mock/{en,ar}/plans.json`.
