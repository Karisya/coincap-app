// src/redux/slices/timeFrameSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type ChartOptions = 'day' | '12hours' | '1hour';

interface TimeFrameState {
    timeFrame: ChartOptions;
}

const initialState: TimeFrameState = {
    timeFrame: 'day',
};

const timeFrameSlice = createSlice({
    name: 'timeFrame',
    initialState,
    reducers: {
        setTimeFrame(state, action: PayloadAction<ChartOptions>) {
            state.timeFrame = action.payload;
        },
    },
});

export const { setTimeFrame } = timeFrameSlice.actions;
export default timeFrameSlice.reducer;
