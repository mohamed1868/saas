# Notifications

**Route:** `/dashboard/notifications` · **Page:** `src/features/private/pages/NotificationsPage.tsx`

The company's activity feed. Reached from the user menu in the sidebar, which also shows the unread count.

## What the page does

- **Subtitle** counts unread notifications.
- **Mark all as read** button, disabled when nothing is unread.
- **Filter** by type, plus an **unread only** toggle.
- **Feed** of cards: type icon, title, body, relative-free timestamp, a "New" pill while unread, a mark-read action and a delete action. Unread cards get a primary-tinted border.

This page has no table and no pagination — it renders the filtered list as cards, so it does not use `ListCard`.

## Files

| File | Role |
| --- | --- |
| `pages/NotificationsPage.tsx` | Everything: filters, icons, tones, actions. |
| `types/notifications.ts` | `Notification`, `NOTIFICATION_TYPES`. |
| `api/notifications.ts` | `getNotifications()`. |
| `store/notificationsSlice.ts` | Hand-written slice: `notificationRead`, `allNotificationsRead`, `notificationRemoved`. |

## Data model

```ts
type Notification = {
  id: string
  type: "order" | "stock" | "support" | "system"
  title: string
  body: string
  at: string      // ISO, formatted with formatDateTime()
  read: boolean
}
```

Each type has its own icon and tone, mapped in `TYPE_ICONS` and `TYPE_STYLES` at the top of the page file.

## Why this slice is hand-written

There is no create or update flow — notifications only get marked read (individually or all at once) or removed. The generic `createScopedSlice` add/update reducers would be dead weight.

## Unread badge

`components/layouts/NavUser.tsx` selects the same scope from the store and counts unread items, so the badge in the user menu updates the moment a notification is marked read.

## Translations

`notifications`, `notificationsSubtitle`, `markAllRead`, `markRead`, `unreadOnly`, `noNotifications`, `notificationsLoadFailed`, `new`, `allTypes`, `notificationType_order` · `_stock` · `_support` · `_system`.

## Mock data

`public/mock/{en,ar}/notifications/{volt,aqua}.json`.
