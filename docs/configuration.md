# Configuration and tooling

Every non-source file in the repo, and what changing it affects.

## Build

| File | Notes |
| --- | --- |
| `vite.config.ts` | React plugin, Tailwind v4 plugin, and the `@` → `./src` alias. The alias is declared twice on purpose: here for the bundler, and in `tsconfig.app.json` for the type-checker. |
| `index.html` | The single HTML entry. Sets the title and favicon and loads `/src/main.tsx`. |
| `package.json` | Dependencies and scripts. |

| Script | Runs |
| --- | --- |
| `npm run dev` | Vite dev server (port 5173, or the next free one). |
| `npm run build` | `tsc -b` then `vite build` — type errors fail the build. |
| `npm run preview` | Serves `dist/` locally. |
| `npm run lint` | ESLint over the repo. |

## TypeScript

`tsconfig.json` is a solution file referencing two projects:

- `tsconfig.app.json` — everything in `src`. Notable flags: `noUnusedLocals` and `noUnusedParameters` (dead code fails the build), `verbatimModuleSyntax` (type-only imports must say `import type`), `erasableSyntaxOnly` (no enums or parameter properties), `moduleResolution: "bundler"`.
- `tsconfig.node.json` — the Vite config itself.

## ESLint — `eslint.config.js`

Flat config: JS recommended, TypeScript recommended, React Hooks recommended, React Refresh for Vite. Two scoped exceptions:

- `components/theme-provider.tsx` may export `useTheme` next to the component.
- `components/ui/**` and `hooks/use-mobile.ts` relax the React Refresh and two React Hooks rules, since those files come from shadcn/ui as-is.

## Environment

| Variable | Effect |
| --- | --- |
| `VITE_USE_MOCKS` | `true` reads from `public/mock`; `false` sends real requests to `VITE_API_URL`. |
| `VITE_API_URL` | Base URL when mocks are off. |
| `VITE_WEB3FORMS_KEY` | Access key for the plan request form. Missing it makes the dialog show `missingFormKey`. |

`.env` is git-ignored; `.env.example` documents the shape. Only variables prefixed with `VITE_` reach the browser bundle — and everything in that bundle is public, so never put a secret there.

## shadcn/ui — `components.json`

Generator settings: `new-york` style, no RSC, TSX, CSS variables, lucide icons, and the `@/components` · `@/lib` · `@/hooks` aliases. `npx shadcn add <component>` uses this file to place and style new primitives.

## Deployment — `vercel.json`

```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```

Without this, a hard refresh on `/dashboard/invoices` would 404 — the server must hand every path to the SPA. Any static host needs the equivalent fallback.

## Styling entry — `src/index.css`

Not a config file, but it plays the same role for design:

1. Tailwind, `tw-animate-css`, shadcn's stylesheet and the Geist font.
2. The `@theme inline` block mapping design tokens onto Tailwind utilities.
3. `:root` (light) and `.dark` token values in OKLCH, with the hex equivalent in a comment.
4. Keyframes (`aurora`, `float`, `shine`) and a reduced-motion override.
5. The print block: `.print-sheet` is hidden on screen, and in print everything except it is hidden.

Changing a brand colour means editing the token in both `:root` and `.dark` — never a hard-coded colour in a component.

## Git

`.gitignore` covers `node_modules`, `dist`, `.env`, `.claude` and the usual editor files. Build output is never committed.
