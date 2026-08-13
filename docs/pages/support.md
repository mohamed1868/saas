# Support

**Route:** `/dashboard/support` · **Page:** `src/features/private/pages/SupportPage.tsx`

Support tickets between the company and the FluxSync team, plus direct contact channels.

## What the page does

- **Subtitle** counts tickets that are still `open`.
- **Contact channels** — email, phone and WhatsApp cards built from `config/site.ts`, with the subject and message pre-filled and translated.
- **Search** by subject or ticket number; **filter** by status and priority.
- **Table** — subject with number, category, priority badge, status badge, last update. Clicking the subject opens the thread.
- **New ticket dialog** — subject, category, priority and the first message.
- **Thread dialog** — the full conversation, a status select, and a reply box.
- **Delete** goes through a confirmation dialog.

Pagination shows 8 rows per page.

## Files

| File | Role |
| --- | --- |
| `pages/SupportPage.tsx` | Filters, ticket creation, replies, status changes. |
| `components/support/SupportTable.tsx` | Rows with priority and status badges. |
| `components/support/SupportToolbar.tsx` | Search plus status and priority filters. |
| `components/support/NewTicketDialog.tsx` | New ticket form. |
| `components/support/TicketThreadDialog.tsx` | Conversation view and reply box. |
| `components/support/SupportChannels.tsx` | Email / phone / WhatsApp cards. |
| `types/support.ts` | `Ticket`, `TicketMessage`, and the status/priority/category constants. |
| `api/support.ts` | `getTickets()`. |
| `store/supportSlice.ts` | Hand-written slice (needs `ticketReplied`). |

## Data model

```ts
type Ticket = {
  id: string
  number: string        // "TCK-1201"
  subject: string
  category: "technical" | "billing" | "account" | "feature"
  priority: "low" | "medium" | "high" | "urgent"
  status: "open" | "pending" | "resolved" | "closed"
  createdAt: string     // ISO
  updatedAt: string     // ISO
  messages: { id, from: "company" | "support", author, body, at }[]
}
```

Dates here are ISO strings formatted at render time with `formatDateTime(iso, language)` — unlike orders and invoices, whose dates arrive pre-formatted from the mock data.

## Why this slice is hand-written

`ticketReplied` does three things at once, which the generic factory does not cover:

1. appends the message,
2. sets `updatedAt` to the message timestamp,
3. reopens the ticket if it was `resolved` or `closed`.

Replies are attributed to the signed-in user (`session.name`) with `from: "company"`.

## Numbering

`nextNumber()` takes the highest `TCK-####`, with a floor of `1200`, and adds one.

## Translations

`support`, `supportSubtitle`, `ticket`, `priority`, `lastUpdate`, `openTicket`, `newTicket`, `newTicketSubtitle`, `subject`, `sendTicket`, `sendReply`, `replyPlaceholder`, `searchTickets`, `allPriorities`, `noTickets`, `ticketsLoadFailed`, `deleteTicket`, `deleteTicketBody`, `subjectRequired`, `messageRequired`, `ticketStatus_*` (4), `ticketPriority_*` (4), `ticketCategory_*` (4), plus the channel keys `emailUs`, `callUs`, `whatsapp`, `emailSubject`, `whatsappMessage`.

## Mock data

`public/mock/{en,ar}/support/{volt,aqua}.json` — tickets with their full message threads.
