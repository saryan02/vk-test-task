import cardSlice from './slices/card/slice'
import filterSlice from './slices/filter/slice'
import {configureStore} from "@reduxjs/toolkit";

export const store = configureStore({
    reducer : {
        cardSlice,
        filterSlice
    }
})

export type RootState = ReturnType<typeof  store.getState>
export type AppDispatch = typeof store.dispatch