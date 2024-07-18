import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { coinApi } from '../api/coinApi';
import searchReducer from './reducers/searchTextSlice';
import timeFrameReducer from './reducers/timeFrameSlice';
import portfolioSlice from './reducers/portfolioSlice';
import popularCoinsSlice from './reducers/popularCoinsSlice';
import isModalVisibleSlice from './reducers/modalSlice';
import quantitySlice from './reducers/quantitySlice';
import modalVisibilitySlice from './reducers/modalVisibilitySlice';
import selectedCoinSlice from './reducers/selectedCoinSlice';
const rootReducer = combineReducers({
    [coinApi.reducerPath]: coinApi.reducer,
    search: searchReducer,
    timeFrame: timeFrameReducer,
    portfolio: portfolioSlice,
    popularCoins: popularCoinsSlice,
    modal: isModalVisibleSlice,
    quantity: quantitySlice,
    modalVisible: modalVisibilitySlice,
    selectedCoin:selectedCoinSlice,
});

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(coinApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
