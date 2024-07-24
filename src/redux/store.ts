import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { coinApi } from '../api/coinApi';
import searchSlice from './reducers/searchTextSlice';
import timeFrameSlice from './reducers/timeFrameSlice';
import portfolioSlice from './reducers/portfolioSlice';
import popularCoinsSlice from './reducers/popularCoinsSlice';
import isModalVisibleSlice from './reducers/modalSlice';
import quantitySlice from './reducers/quantitySlice';
import modalVisibilitySlice from './reducers/modalVisibilitySlice';
import selectedCoinSlice from './reducers/selectedCoinSlice';
import coinsSlice from './reducers/coinsSlice'
import paginationSlice from './reducers/paginationSlice'
import apiDataSlice from './reducers/apiDataSlice'

const rootReducer = combineReducers({
    [coinApi.reducerPath]: coinApi.reducer,
    search: searchSlice,
    timeFrame: timeFrameSlice,
    portfolio: portfolioSlice,
    popularCoins: popularCoinsSlice,
    modal: isModalVisibleSlice,
    quantity: quantitySlice,
    modalVisible: modalVisibilitySlice,
    selectedCoin: selectedCoinSlice,
    pagination: paginationSlice,
    coins: coinsSlice,
    apiData: apiDataSlice,
});

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(coinApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
