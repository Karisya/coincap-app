import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PaginationState {
    currentPage: number;
    pageSize: number;
    totalCoins: number;
}

const initialState: PaginationState = {
    currentPage: 1,
    pageSize: 10,
    totalCoins: 0,
};

const paginationSlice = createSlice({
    name: 'pagination',
    initialState,
    reducers: {
        setCurrentPage: (state, action: PayloadAction<number>) => {
            state.currentPage = action.payload;
        },
        setPageSize: (state, action: PayloadAction<number>) => {
            state.pageSize = action.payload;
        },
        setTotalCoins: (state, action: PayloadAction<number>) => {
            state.totalCoins = action.payload;
        },
    },
});

export const { setCurrentPage, setPageSize, setTotalCoins } = paginationSlice.actions;
export default paginationSlice.reducer;
