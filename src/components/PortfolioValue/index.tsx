import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { PortfolioCoin } from '../../redux/reducers/portfolioSlice';
import styles from './index.module.scss';

export const calculateCurrentPortfolioValue = (coins: PortfolioCoin[]): number => {
    let portfolioValue = 0;
    coins.forEach(({ coin, quantity }) => {
        if (coin && coin.priceUsd) {
            portfolioValue += parseFloat(coin.priceUsd) * quantity;
        }
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
    const portfolio = useSelector((state: RootState) => state.portfolio.coins);
    const currentPortfolioValue = calculateCurrentPortfolioValue(portfolio);
    const purchasePortfolioValue = calculatePurchasePortfolioValue(portfolio);

    const difference = currentPortfolioValue - purchasePortfolioValue;
    const percentageDifference = ((difference / purchasePortfolioValue) * 100).toFixed(2);

    return (
        <div className={styles.portfolioContainer}>
            <p className={styles.portfolioValue}>
                {currentPortfolioValue.toFixed(2)} USD {difference >= 0 ? '+' : ''}{difference.toFixed(2)} ({difference >= 0 ? '+' : ''}{percentageDifference}%)
            </p>
        </div>
    );
};

export default PortfolioValue;
