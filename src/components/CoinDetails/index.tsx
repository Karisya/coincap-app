import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Spin, Alert} from 'antd';
import { useGetCoinByIdQuery } from '../../api/coinApi';

interface CoinDetailsProps { }

const CoinDetails: React.FC<CoinDetailsProps> = () => {
    const { id } = useParams<{ id: string }>();
    const { data, error, isLoading } = useGetCoinByIdQuery(id);

    if (isLoading) return <Spin size="large" />;
    if (error) return <Alert message="Ошибка" description="Не удалось загрузить данные" type="error" showIcon />;

    if (!data) {
        return <Alert message="Ошибка" description="Неверный ID монеты" type="error" showIcon />;
    }

    const coin = data.data;

    return (
        <div>
            <Link to="/">Вернуться назад</Link>
            <img src={`https://assets.coincap.io/assets/icons/${coin.symbol.toLowerCase()}@2x.png`} alt={coin.name} width="50" />
            <h1>{coin.name} ({coin.symbol})</h1>
            <p>Rank: {coin.rank}</p>
            <p>Supply: {coin.supply}</p>
            <p>Цена в USD: ${parseFloat(coin.priceUsd).toFixed(2)}</p>
            <p>Рыночная капитализация в USD: ${parseFloat(coin.marketCapUsd).toFixed(2)}</p>
            <p>Max Supply: {coin.maxSupply}</p>
        </div>
    );
};


export default CoinDetails;
