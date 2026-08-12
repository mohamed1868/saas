import { combineReducers, configureStore } from "@reduxjs/toolkit"
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from "redux-persist"

import customersReducer from "@/store/customersSlice"
import ordersReducer from "@/store/ordersSlice"
import productsReducer from "@/store/productsSlice"

const storage = {
  getItem: (key: string) => Promise.resolve(localStorage.getItem(key)),
  setItem: (key: string, value: string) => Promise.resolve(localStorage.setItem(key, value)),
  removeItem: (key: string) => Promise.resolve(localStorage.removeItem(key)),
}

const persisted = (key: string) => ({
  key,
  version: 2,
  storage,
  whitelist: ["byScope"],
})

const rootReducer = combineReducers({
  products: persistReducer(persisted("products"), productsReducer),
  customers: persistReducer(persisted("customers"), customersReducer),
  orders: persistReducer(persisted("orders"), ordersReducer),
})

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
