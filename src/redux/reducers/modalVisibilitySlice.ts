import { createSlice } from '@reduxjs/toolkit';

interface ModalVisibilityState {
    quantityModalVisible: boolean;
    portfolioModalVisible: boolean;
}

const initialState: ModalVisibilityState = {
    quantityModalVisible: false,
    portfolioModalVisible: false,
};

const modalVisibilitySlice = createSlice({
    name: 'modalVisibility',
    initialState,
    reducers: {
        showQuantityModal: (state) => {
            state.quantityModalVisible = true;
        },
        hideQuantityModal: (state) => {
            state.quantityModalVisible = false;
        },
        showPortfolioModal: (state) => {
            state.portfolioModalVisible = true;
        },
        hidePortfolioModal: (state) => {
            state.portfolioModalVisible = false;
        },
        
    },
});

export const {
    showQuantityModal,
    hideQuantityModal,
    showPortfolioModal,
    hidePortfolioModal,
} = modalVisibilitySlice.actions;
export default modalVisibilitySlice.reducer;
