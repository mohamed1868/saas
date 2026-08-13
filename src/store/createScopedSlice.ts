import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
  type Reducer,
} from "@reduxjs/toolkit"

export type LoadStatus = "idle" | "loading" | "ready" | "failed"

export type ScopedState<T> = {
  byScope: Record<string, T[]>
  statusByScope: Record<string, LoadStatus>
}

export type ScopedItem = {
  id: string
}

export function createScopedSlice<T extends ScopedItem>(
  name: string,
  loadItems: () => Promise<T[]>,
) {
  const fetchAll = createAsyncThunk(`${name}/fetch`, async (scope: string) => {
    const items = await loadItems()
    return { scope, items }
  })

  const initialState: ScopedState<ScopedItem> = {
    byScope: {},
    statusByScope: {},
  }

  const slice = createSlice({
    name,
    initialState,
    reducers: {
      itemAdded: (state, action: PayloadAction<{ scope: string; item: ScopedItem }>) => {
        const { scope, item } = action.payload
        state.byScope[scope] = [item, ...(state.byScope[scope] ?? [])]
      },

      itemUpdated: (
        state,
        action: PayloadAction<{ scope: string; id: string; changes: Partial<ScopedItem> }>,
      ) => {
        const { scope, id, changes } = action.payload
        const item = state.byScope[scope]?.find((entry) => entry.id === id)

        if (item) Object.assign(item, changes)
      },

      itemRemoved: (state, action: PayloadAction<{ scope: string; id: string }>) => {
        const { scope, id } = action.payload
        const items = state.byScope[scope]

        if (items) state.byScope[scope] = items.filter((entry) => entry.id !== id)
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(fetchAll.pending, (state, action) => {
          state.statusByScope[action.meta.arg] = "loading"
        })
        .addCase(fetchAll.fulfilled, (state, action) => {
          state.byScope[action.payload.scope] = action.payload.items
          state.statusByScope[action.payload.scope] = "ready"
        })
        .addCase(fetchAll.rejected, (state, action) => {
          state.statusByScope[action.meta.arg] = "failed"
        })
    },
  })

  const { itemAdded, itemUpdated, itemRemoved } = slice.actions

  return {
    fetchAll,
    reducer: slice.reducer as unknown as Reducer<ScopedState<T>>,
    itemAdded: (payload: { scope: string; item: T }) => itemAdded(payload),
    itemUpdated: (payload: { scope: string; id: string; changes: Partial<T> }) =>
      itemUpdated(payload),
    itemRemoved: (payload: { scope: string; id: string }) => itemRemoved(payload),
  }
}
