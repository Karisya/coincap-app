import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Coin } from '../../types/types';
import axios from 'axios';

interface PopularCoinsState {
    coins: Coin[];
    loading: boolean;
    error: string | null;
}

const initialState: PopularCoinsState = {
    coins: [],
    loading: false,
    error: null,
};

export const fetchPopularCoins = createAsyncThunk('popularCoins/fetchPopularCoins', async () => {
    const response = await axios.get('https://api.coincap.io/v2/assets');
    const sortedCoins = response.data.data
        .sort((a: Coin, b: Coin) => parseFloat(b.marketCapUsd) - parseFloat(a.marketCapUsd))
        .slice(0, 3);
    return sortedCoins;
});

const popularCoinsSlice = createSlice({
    name: 'popularCoins',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPopularCoins.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPopularCoins.fulfilled, (state, action) => {
                state.coins = action.payload;
                state.loading = false;
            })
            .addCase(fetchPopularCoins.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch popular coins';
            });
    },
});

export default popularCoinsSlice.reducer;
