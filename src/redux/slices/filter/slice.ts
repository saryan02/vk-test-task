import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {FilterState} from "./types";

const initialState: FilterState = {
    sort: ''
}
const filterSlice = createSlice({
    name:'filter',
    initialState,
    reducers: {
        setSort(state, action:PayloadAction<FilterState['sort']>){
            state.sort = action.payload;

        }
    }
})
export const {setSort} = filterSlice.actions;
export default filterSlice.reducer