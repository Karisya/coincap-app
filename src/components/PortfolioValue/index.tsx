import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store';
import { PortfolioCoin } from '../../redux/reducers/portfolioSlice';
import { fetchApiData } from '../../redux/reducers/apiDataSlice';
import styles from './index.module.scss';

export const calculateCurrentPortfolioValue = (coins: PortfolioCoin[], apiData: Record<string, number>): number => {
    let portfolioValue = 0;
    coins.forEach(({ coin, quantity }) => {
        const currentPrice = apiData[coin.id] || parseFloat(coin.priceUsd);
        portfolioValue += currentPrice * quantity;
    });
    return portfolioValue;
};

export const calculatePurchasePortfolioValue = (coins: PortfolioCoin[]): number => {
    let portfolioValue = 0;
    coins.forEach(({ purchasePriceUsd, quantity }) => {
        portfolioValue += purchasePriceUsd * quantity;
    });
    return portfolioValue;
};

const PortfolioValue: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const portfolio = useSelector((state: RootState) => state.portfolio.coins);
    const apiData = useSelector((state: RootState) => state.apiData.data);
    const loading = useSelector((state: RootState) => state.apiData.loading);
    const error = useSelector((state: RootState) => state.apiData.error);

    useEffect(() => {
        dispatch(fetchApiData());
    }, [dispatch]);

    if (loading) {
        return <div className={styles.loading}>Loading...</div>;
    }

    if (error) {
        return <div className={styles.error}>{error}</div>;
    }

    const currentPortfolioValue = calculateCurrentPortfolioValue(portfolio, apiData);
    const purchasePortfolioValue = calculatePurchasePortfolioValue(portfolio);

    const difference = currentPortfolioValue - purchasePortfolioValue;
    const percentageDifference = purchasePortfolioValue ? ((difference / purchasePortfolioValue) * 100).toFixed(2) : '0.00';

    return (
        <div className={styles.portfolioContainer}>
            <p className={styles.portfolioValue}>
                {currentPortfolioValue.toFixed(2)} USD {difference >= 0 ? '+' : ''}{difference.toFixed(2)} ({difference >= 0 ? '+' : ''}{percentageDifference}%)
            </p>
        </div>
    );
};

export default PortfolioValue;
