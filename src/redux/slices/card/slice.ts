import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import axios from "axios";
import {CartStateInterface, ItemsGettingType, ItemsType} from "./types";
import { setSort } from "../filter/slice";



const initialState: CartStateInterface = {
    items: [],
    totalCount: 0
};
export const fetchCarts = createAsyncThunk(
    'carts/fetchCarts',
    async ({page, sort}:{page:number, sort:string}, thunkAPI) => {
        const sortOrder = sort === "asc" ? "asc" : sort === "desc" ? "desc" : "";
        const sortParam = sortOrder ? `&sort=stars&order=${sortOrder}` : "";
        const res = await axios.get(`https://api.github.com/search/repositories?q=javascript&per_page=5&page=${page}${sortParam}`);

        if (!res.data.items.length) {
            return thunkAPI.rejectWithValue('ничего нет');
        }
        const filteredItems = res.data.items.map((item: ItemsGettingType) =>
            ({
                stars:item.stars,
                id: item.id,
                avatar: item.owner.avatar_url,
                name: item.name,
                login: item.owner.login,
                type: item.owner.type


            }));
        return({filteredItems, totalCount: res.data.total_count});

    }
)


const cardSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        deleteCart: (state, action:PayloadAction<number>) => {
            state.items = state.items.filter((item:ItemsType) => (item.id !== action.payload))
        },
        updateCart: (state, action: PayloadAction<{ id: number; login: string; type: string; name: string }>) => {

            state.items = state.items.map((item: ItemsType) => {
                if (item.id === action.payload.id) {
                    return {
                        ...item,
                        login: action.payload.login,
                        type: action.payload.type,
                        name: action.payload.name
                    };
                }
                return item;
            });
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCarts.fulfilled, (state, action) => {
                const newItems = action.payload.filteredItems.filter(
                    (item:ItemsType) => !state.items.some((existingItem) => existingItem.id === item.id)
                );
                state.items.push(...newItems);
                state.totalCount = action.payload.totalCount
            })
            .addCase(fetchCarts.rejected, (_state, action) => {
                console.log(action.payload)
            })
            .addMatcher((action) => action.type === setSort.type, (state) => {
                state.items = [];
            });
    }
})
export const {deleteCart, updateCart} = cardSlice.actions;
export default cardSlice.reducer