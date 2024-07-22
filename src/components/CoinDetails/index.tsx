import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetCoinByIdQuery } from '../../api/coinApi';
import { Spin, Alert, Select } from 'antd';
import { Line } from 'react-chartjs-2';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { setTimeFrame } from '../../redux/reducers/timeFrameSlice';
import { CategoryScale, Chart, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { ChartOptions, CoinDetailsProps } from '../../types/types';
import { addCoin } from '../../redux/reducers/portfolioSlice';
import { setQuantity } from '../../redux/reducers/quantitySlice';
import { showQuantityModal, hideQuantityModal, showPortfolioModal, hidePortfolioModal } from '../../redux/reducers/modalVisibilitySlice';
import PortfolioValue from '../PortfolioValue';
import Button from '../../common/Button';
import Modal from '../../common/Modal';
import { InputNumber } from '../../common/Input';
import styles from './index.module.scss';

Chart.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

const { Option } = Select;

const getChartData = (labels: string[], dataPoints: number[]) => {
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

const fetchHistoryData = async (coinId: string, timeFrame: ChartOptions) => {
    const now = new Date();
    let interval: string;
    let start: number;

    if (timeFrame === 'day') {
        interval = 'm15';
        start = now.setDate(now.getDate() - 1);
    } else if (timeFrame === '12hours') {
        interval = 'm5';
        start = now.setHours(now.getHours() - 12);
    } else if (timeFrame === '1hour') {
        interval = 'm1';
        start = now.setHours(now.getHours() - 1);
    } else {
        throw new Error('Unsupported time frame');
    }

    const url = `https://api.coincap.io/v2/assets/${coinId}/history?interval=${interval}&start=${start}&end=${Date.now()}`;
    const response = await fetch(url);
    const data = await response.json();

    return data.data;
};

const CoinDetails: React.FC<CoinDetailsProps> = () => {
    const { id } = useParams<{ id: string }>();
    const dispatch = useDispatch();
    const timeFrame = useSelector((state: RootState) => state.timeFrame.timeFrame);
    const quantity = useSelector((state: RootState) => state.quantity.quantity);
    const quantityModalVisible = useSelector((state: RootState) => state.modalVisible.quantityModalVisible);
    const portfolioModalVisible = useSelector((state: RootState) => state.modalVisible.portfolioModalVisible);
    const portfolio = useSelector((state: RootState) => state.portfolio.coins);

    const { data, error, isLoading } = useGetCoinByIdQuery(id);

    const [chartData, setChartData] = useState<any>({ labels: [], datasets: [] });

    useEffect(() => {
        if (data && id) {
            fetchHistoryData(id, timeFrame).then(historyData => {
                const labels = historyData.map((entry: any) => new Date(entry.time).toLocaleTimeString());
                const dataPoints = historyData.map((entry: any) => parseFloat(entry.priceUsd));
                setChartData(getChartData(labels, dataPoints));
            });
        }
    }, [data, id, timeFrame]);

    const handleAddToPortfolio = () => {
        dispatch(showQuantityModal());
    };

    const handleConfirmAddToPortfolio = () => {
        if (data) {
            const coinData = data.data;
            if (coinData && coinData.id && coinData.priceUsd) {
                dispatch(addCoin({ coin: coinData, quantity }));
                dispatch(hideQuantityModal());
                dispatch(showPortfolioModal());
                dispatch(setQuantity(1));
            }
        }
    };

    const handleCancelQuantityModal = () => {
        dispatch(hideQuantityModal());
    };

    const handleClosePortfolioModal = () => {
        dispatch(hidePortfolioModal());
    };

    if (isLoading) return (
        <div className={styles.loading}>
            <Spin size="large" />
        </div>
    );

    if (error) return <Alert message="Ошибка" description="Не удалось загрузить данные" type="error" showIcon />;

    if (!data) {
        return <Alert message="Ошибка" description="Неверный ID монеты" type="error" showIcon />;
    }

    const coin = data.data;

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
                    <Button onClick={handleAddToPortfolio}>Добавить в портфель</Button>
                </div>

                <Line className={styles.coinDetailsChart} data={chartData} />
            </div>

            <Modal
                title="Введите количество монет"
                visible={quantityModalVisible}
                onCancel={handleCancelQuantityModal}
                footer={[
                    <Button key="cancel" onClick={handleCancelQuantityModal}>
                        Отмена
                    </Button>,
                    <Button key="confirm" type="primary" onClick={handleConfirmAddToPortfolio}>
                        Добавить
                    </Button>,
                ]}
            >
                <p>Введите количество монет для добавления в портфель:</p>
                <InputNumber
                    min={1}
                    max={1000}
                    value={quantity}
                    onChange={(value) => dispatch(setQuantity(value as number))}
                    style={{ width: '100%' }}
                />
            </Modal>

            <Modal
                title="Список монет в портфеле"
                visible={portfolioModalVisible}
                onCancel={handleClosePortfolioModal}
                footer={[
                    <Button key="close" onClick={handleClosePortfolioModal}>
                        Закрыть
                    </Button>,
                ]}
            >
                {portfolio.length > 0 ? (
                    <PortfolioValue />
                ) : (
                    <p>Ваш портфель пуст</p>
                )}
            </Modal>
        </div>
    );
};

export default CoinDetails;
