// src/redux/reducers/coinsSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Coin } from '../../types/types';

interface CoinsState {
    coins: Coin[];
}

const initialState: CoinsState = {
    coins: [],
};

const coinsSlice = createSlice({
    name: 'coins',
    initialState,
    reducers: {
        setCoins: (state, action: PayloadAction<Coin[]>) => {
            state.coins = action.payload;
        },
    },
});

export const { setCoins } = coinsSlice.actions;
export default coinsSlice.reducer;
