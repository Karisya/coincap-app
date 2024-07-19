import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store';
import { Coin } from '../../types/types';
import { Table } from 'antd';
import { removeCoin } from '../../redux/reducers/portfolioSlice';
import { fetchPopularCoins } from '../../redux/reducers/popularCoinsSlice';
import { showModal, hideModal } from '../../redux/reducers/modalSlice';
import PortfolioValue from '../PortfolioValue';
import Modal from '../../common/Modal';
import Button from '../../common/Button';
import styles from './index.module.scss';

const Header: React.FC = () => {
    const portfolio = useSelector((state: RootState) => state.portfolio.coins);
    const isModalVisible = useSelector((state: RootState) => state.modal.isVisible);
    const { coins: popularCoins, loading, error } = useSelector((state: RootState) => state.popularCoins);
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        dispatch(fetchPopularCoins());
    }, [dispatch]);

    const handleShowModal = () => {
        dispatch(showModal());
    };

    const handleHideModal = () => {
        dispatch(hideModal());
    };

    const handleRemoveCoin = (id: string) => {
        dispatch(removeCoin(id));
    };

    const columns = [
        {
            title: 'Символ',
            dataIndex: 'coin',
            key: 'symbol',
            render: (coin: Coin) => coin.symbol,
        },
        {
            title: 'Название',
            dataIndex: 'coin',
            key: 'name',
            render: (coin: Coin) => coin.name,
        },
        {
            title: 'Количество',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: 'Цена (USD)',
            dataIndex: 'coin',
            key: 'priceUsd',
            render: (coin: Coin) => `$${parseFloat(coin.priceUsd).toFixed(2)}`,
        },
        {
            title: 'Действие',
            key: 'action',
            render: (text: any, record: any) => (
                <Button onClick={() => handleRemoveCoin(record.coin.id)}>Удалить</Button>
            ),
        },
    ];

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error loading data: {error}</div>;

    return (
        <div className={styles.header}>
            <div>
                <h3>Курс трех популярных криптовалют:</h3>
                <div className={styles.popularCoins}>
                    {popularCoins.map(coin => (
                        <div key={coin.id}>
                            {coin.name}: <span className={styles.coinPrice}>${parseFloat(coin.priceUsd).toFixed(2)}</span>
                        </div>
                    ))}
                </div>
            </div>
            <div className={styles.portfolioValue}>
                <h3>Стоимость портфеля пользователя:</h3>
                <Button type="link" onClick={handleShowModal}>
                    <PortfolioValue />
                </Button>
            </div>
            <Modal
                title="Ваш Портфель"
                visible={isModalVisible}
                onOk={handleHideModal}
                onCancel={handleHideModal}
                className={styles.modal}
            >
                <Table columns={columns} dataSource={portfolio} rowKey="coin.id" pagination={false} />
            </Modal>
        </div>
    );
};

export default Header;
