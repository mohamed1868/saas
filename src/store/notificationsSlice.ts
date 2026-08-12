import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit"

import { getNotifications } from "@/features/private/api/notifications"
import type { Notification } from "@/features/private/types/notifications"

type LoadStatus = "idle" | "loading" | "ready" | "failed"

type NotificationsState = {
  byScope: Record<string, Notification[]>
  statusByScope: Record<string, LoadStatus>
}

const initialState: NotificationsState = {
  byScope: {},
  statusByScope: {},
}

export const fetchNotifications = createAsyncThunk(
  "notifications/fetch",
  async (scope: string) => {
    const items = await getNotifications()
    return { scope, items }
  },
)

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    notificationRead: (state, action: PayloadAction<{ scope: string; id: string }>) => {
      const { scope, id } = action.payload
      const notification = state.byScope[scope]?.find((item) => item.id === id)

      if (notification) notification.read = true
    },

    allNotificationsRead: (state, action: PayloadAction<{ scope: string }>) => {
      const items = state.byScope[action.payload.scope]

      if (items) items.forEach((item) => (item.read = true))
    },

    notificationRemoved: (state, action: PayloadAction<{ scope: string; id: string }>) => {
      const { scope, id } = action.payload
      const items = state.byScope[scope]

      if (items) state.byScope[scope] = items.filter((item) => item.id !== id)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state, action) => {
        state.statusByScope[action.meta.arg] = "loading"
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.byScope[action.payload.scope] = action.payload.items
        state.statusByScope[action.payload.scope] = "ready"
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.statusByScope[action.meta.arg] = "failed"
      })
  },
})

export const { notificationRead, allNotificationsRead, notificationRemoved } =
  notificationsSlice.actions

export default notificationsSlice.reducer
