import { createAsyncThunk, createSlice, type Draft, type PayloadAction } from "@reduxjs/toolkit"

type LoadStatus = "idle" | "loading" | "ready" | "failed"

type RecordsState<T> = {
  byScope: Record<string, T[]>
  statusByScope: Record<string, LoadStatus>
}

export function createRecordsSlice<T extends { id: string }>(
  name: string,
  fetchAll: () => Promise<T[]>,
) {
  const fetch = createAsyncThunk(`${name}/fetch`, async (scope: string) => ({
    scope,
    items: await fetchAll(),
  }))

  const initialState: RecordsState<T> = { byScope: {}, statusByScope: {} }

  const slice = createSlice({
    name,
    initialState,
    reducers: {
      added: (state, action: PayloadAction<{ scope: string; record: T }>) => {
        const { scope, record } = action.payload
        state.byScope[scope] = [record as Draft<T>, ...(state.byScope[scope] ?? [])]
      },

      updated: (
        state,
        action: PayloadAction<{ scope: string; id: string; changes: Partial<T> }>,
      ) => {
        const { scope, id, changes } = action.payload
        const items = state.byScope[scope]
        if (!items) return

        const index = items.findIndex((item) => item.id === id)
        if (index !== -1) items[index] = { ...items[index], ...changes } as Draft<T>
      },

      removed: (state, action: PayloadAction<{ scope: string; id: string }>) => {
        const { scope, id } = action.payload
        const items = state.byScope[scope]
        if (!items) return

        state.byScope[scope] = items.filter((item) => item.id !== id)
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(fetch.pending, (state, action) => {
          state.statusByScope[action.meta.arg] = "loading"
        })
        .addCase(fetch.fulfilled, (state, action) => {
          state.byScope[action.payload.scope] = action.payload.items as Draft<T>[]
          state.statusByScope[action.payload.scope] = "ready"
        })
        .addCase(fetch.rejected, (state, action) => {
          state.statusByScope[action.meta.arg] = "failed"
        })
    },
  })

  return { reducer: slice.reducer, fetch, ...slice.actions }
}
