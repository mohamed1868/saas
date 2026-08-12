import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit"

import { getTickets } from "@/features/private/api/support"
import type { Ticket, TicketMessage } from "@/features/private/types/support"

type LoadStatus = "idle" | "loading" | "ready" | "failed"

type SupportState = {
  byScope: Record<string, Ticket[]>
  statusByScope: Record<string, LoadStatus>
}

const initialState: SupportState = {
  byScope: {},
  statusByScope: {},
}

export const fetchTickets = createAsyncThunk("support/fetch", async (scope: string) => {
  const items = await getTickets()
  return { scope, items }
})

const supportSlice = createSlice({
  name: "support",
  initialState,
  reducers: {
    ticketAdded: (state, action: PayloadAction<{ scope: string; ticket: Ticket }>) => {
      const { scope, ticket } = action.payload
      state.byScope[scope] = [ticket, ...(state.byScope[scope] ?? [])]
    },

    ticketUpdated: (
      state,
      action: PayloadAction<{ scope: string; id: string; changes: Partial<Ticket> }>,
    ) => {
      const { scope, id, changes } = action.payload
      const ticket = state.byScope[scope]?.find((item) => item.id === id)

      if (ticket) Object.assign(ticket, changes)
    },

    ticketReplied: (
      state,
      action: PayloadAction<{ scope: string; id: string; message: TicketMessage }>,
    ) => {
      const { scope, id, message } = action.payload
      const ticket = state.byScope[scope]?.find((item) => item.id === id)

      if (!ticket) return

      ticket.messages.push(message)
      ticket.updatedAt = message.at
      if (ticket.status === "resolved" || ticket.status === "closed") ticket.status = "open"
    },

    ticketRemoved: (state, action: PayloadAction<{ scope: string; id: string }>) => {
      const { scope, id } = action.payload
      const items = state.byScope[scope]

      if (items) state.byScope[scope] = items.filter((item) => item.id !== id)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTickets.pending, (state, action) => {
        state.statusByScope[action.meta.arg] = "loading"
      })
      .addCase(fetchTickets.fulfilled, (state, action) => {
        state.byScope[action.payload.scope] = action.payload.items
        state.statusByScope[action.payload.scope] = "ready"
      })
      .addCase(fetchTickets.rejected, (state, action) => {
        state.statusByScope[action.meta.arg] = "failed"
      })
  },
})

export const { ticketAdded, ticketUpdated, ticketReplied, ticketRemoved } = supportSlice.actions

export default supportSlice.reducer
