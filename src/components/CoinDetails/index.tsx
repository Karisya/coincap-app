import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetCoinByIdQuery } from '../../api/coinApi';
import { Spin, Alert, Select } from 'antd';
import { Line } from 'react-chartjs-2';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { setTimeFrame } from '../../redux/reducers/timeFrameSlice'
import { CategoryScale, Chart, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { ChartOptions } from '../../types/types';
import { CoinDetailsProps } from '../../types/types';
import styles from './index.module.scss'


Chart.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

const { Option } = Select;



const getChartData = (coin: any, timeFrame: ChartOptions) => {
    let labels: string[] = [];
    let dataPoints: number[] = [];

    if (timeFrame === 'day') {
        labels = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'];
        dataPoints = [100, 150, 120, 170, 160, 180];
    } else if (timeFrame === '12hours') {
        labels = ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00'];
        dataPoints = [50, 70, 60, 80, 75, 85];
    } else if (timeFrame === '1hour') {
        labels = ['00:00', '00:15', '00:30', '00:45', '01:00'];
        dataPoints = [10, 12, 15, 14, 16];
    }

    return {
        labels: labels,
        datasets: [
            {
                label: 'Price',
                data: dataPoints,
                borderColor: 'rgba(75,192,192,1)',
                fill: false,
            },
        ],
    };
};

const CoinDetails: React.FC<CoinDetailsProps> = () => {
    const { id } = useParams<{ id: string }>();
    const dispatch = useDispatch();
    const timeFrame = useSelector((state: RootState) => state.timeFrame.timeFrame);
    const { data, error, isLoading } = useGetCoinByIdQuery(id);

    if (isLoading) return (
        <div className={styles.loading}>
            <Spin size="large" />;
        </div >)

    if (error) return <Alert message="Ошибка" description="Не удалось загрузить данные" type="error" showIcon />;

    if (!data) {
        return <Alert message="Ошибка" description="Неверный ID монеты" type="error" showIcon />;
    }

    const coin = data.data;
    const chartData = getChartData(coin, timeFrame);

    return (
        <div className={styles.coinDetails}>
            <div className={styles.coinDetailsBack}>
                <Link to="/">Вернуться назад</Link>
            </div>
            <div className={styles.coinDetailsHolder}>
                <div>
                    <div className={styles.coinDetailsTitle}>
                        <img src={`https://assets.coincap.io/assets/icons/${coin.symbol.toLowerCase()}@2x.png`} alt={coin.name} width="50" />
                        <h1>{coin.name} ({coin.symbol})</h1>
                    </div>
                    <p>Rank: {coin.rank}</p>
                    <p>Supply: {coin.supply}</p>
                    <p>Цена в USD: ${parseFloat(coin.priceUsd).toFixed(2)}</p>
                    <p>Рыночная капитализация в USD: ${parseFloat(coin.marketCapUsd).toFixed(2)}</p>
                    <p>Max Supply: {coin.maxSupply}</p>
                    <Select value={timeFrame} onChange={(value) => dispatch(setTimeFrame(value))} style={{ width: 120 }}>
                        <Option value="day">День</Option>
                        <Option value="12hours">12 часов</Option>
                        <Option value="1hour">1 час</Option>
                    </Select>

                </div>

                <Line className={styles.coinDetailsChart} data={chartData} />
            </div>

        </div>
    );
};

export default CoinDetails;
