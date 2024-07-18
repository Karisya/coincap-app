import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Coin } from '../../types/types'; 

interface SelectedCoinState {
    coin: Coin | null;
}

const initialState: SelectedCoinState = {
    coin: null,
};

const selectedCoinSlice = createSlice({
    name: 'selectedCoin',
    initialState,
    reducers: {
        setSelectedCoin: (state, action: PayloadAction<Coin>) => {
            state.coin = action.payload;
        },
        clearSelectedCoin: (state) => {
            state.coin = null;
        },
    },
});

export const { setSelectedCoin, clearSelectedCoin } = selectedCoinSlice.actions;
export default selectedCoinSlice.reducer;
