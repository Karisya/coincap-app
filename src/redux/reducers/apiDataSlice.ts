import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface ApiDataState {
    data: Record<string, number>;
    loading: boolean;
    error: string | null;
}

const initialState: ApiDataState = {
    data: {},
    loading: false,
    error: null,
};

export const fetchApiData = createAsyncThunk('apiData/fetchApiData', async () => {
    const response = await fetch('https://api.coincap.io/v2/assets');
    const result = await response.json();
    return result.data.reduce((acc: Record<string, number>, coin: any) => {
        acc[coin.id] = parseFloat(coin.priceUsd);
        return acc;
    }, {});
});

const apiDataSlice = createSlice({
    name: 'apiData',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchApiData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchApiData.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchApiData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch data';
            });
    },
});

export default apiDataSlice.reducer;
