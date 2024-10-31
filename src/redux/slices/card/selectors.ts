import {RootState} from "../../store";

export const selectItems = (state: RootState) => state.cardSlice.items;
export const selectTotalCount =  (state: RootState) => state.cardSlice.totalCount;