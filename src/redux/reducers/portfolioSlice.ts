import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Coin } from '../../types/types';

export interface PortfolioCoin {
    coin: Coin;
    quantity: number;
}

interface PortfolioState {
    coins: PortfolioCoin[];
}

const loadPortfolioFromLocalStorage = (): PortfolioCoin[] => {
    const data = localStorage.getItem('portfolio');
    if (data) {
        try {
            const parsedData = JSON.parse(data);
            if (Array.isArray(parsedData)) {
                return parsedData.filter((item): item is PortfolioCoin =>
                    item && item.coin && typeof item.quantity === 'number'
                );
            }
        } catch (e) {
            console.error('Failed to parse portfolio data from localStorage', e);
        }
    }
    return [];
};

const initialState: PortfolioState = {
    coins: loadPortfolioFromLocalStorage(),
};

const portfolioSlice = createSlice({
    name: 'portfolio',
    initialState,
    reducers: {
        addCoin: (state, action: PayloadAction<PortfolioCoin>) => {
            const existingCoin = state.coins.find(pc => pc.coin.id === action.payload.coin.id);
            if (existingCoin) {
                existingCoin.quantity += action.payload.quantity;
            } else {
                state.coins.push(action.payload);
            }
            localStorage.setItem('portfolio', JSON.stringify(state.coins));
        },
        removeCoin: (state, action: PayloadAction<string>) => {
            state.coins = state.coins.filter(coin => coin.coin.id !== action.payload);
            localStorage.setItem('portfolio', JSON.stringify(state.coins));
        },
        clearPortfolio: (state) => {
            state.coins = [];
            localStorage.removeItem('portfolio');
        },
    },
});

export const { addCoin, removeCoin, clearPortfolio } = portfolioSlice.actions;
export default portfolioSlice.reducer;
