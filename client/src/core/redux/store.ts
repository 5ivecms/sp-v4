import { AnyAction, configureStore } from '@reduxjs/toolkit'
import { Dispatch } from 'react'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'

import { KeywordsApi } from './slices/keywords/api'
import { SiteApi } from './slices/site/api'

export const store = configureStore({
  devTools: process.env.NODE_ENV === 'development',
  reducer: {
    [SiteApi.reducerPath]: SiteApi.reducer,
    [KeywordsApi.reducerPath]: KeywordsApi.reducer,
  },
  middleware: (getDefaultMiddleware) => [...getDefaultMiddleware({}), SiteApi.middleware, KeywordsApi.middleware],
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch = (): Dispatch<AnyAction> => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
