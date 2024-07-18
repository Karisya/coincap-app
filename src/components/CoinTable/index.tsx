import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Spin, Alert, Input, Modal, InputNumber } from 'antd';
import { useGetCoinsQuery } from '../../api/coinApi';
import { ColumnsType } from 'antd/lib/table';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store';
import { setSearchText } from '../../redux/reducers/searchTextSlice';
import { addCoin } from '../../redux/reducers/portfolioSlice';
import { setSelectedCoin, clearSelectedCoin } from '../../redux/reducers/selectedCoinSlice';
import { showQuantityModal, hideQuantityModal, } from '../../redux/reducers/modalVisibilitySlice';
import { setQuantity } from '../../redux/reducers/quantitySlice';
import { Coin } from '../../types/types';
import styles from './index.module.scss';

const CoinTable: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const searchText = useSelector((state: RootState) => state.search.searchText);
    const { data, error, isLoading } = useGetCoinsQuery('https://api.coincap.io/v2/assets');
    const navigate = useNavigate();
    const quantityModalVisible = useSelector((state: RootState) => state.modalVisible.quantityModalVisible);
    const selectedCoin = useSelector((state: RootState) => state.selectedCoin.coin);
    const quantity = useSelector((state: RootState) => state.quantity.quantity);

    useEffect(() => {
        if (data) {
            console.log(data);
        }
    }, [data]);

    if (isLoading) return (
        <div className={styles.loading}>
            <Spin size="large" />
        </div>
    );
    if (error) return <Alert message="Ошибка" description="Не удалось загрузить данные" type="error" showIcon />;

    const filteredData = data?.data.filter((coin: Coin) => {
        const price = parseFloat(coin.priceUsd);
        const marketCap = parseFloat(coin.marketCapUsd);
        const changePercent = parseFloat(coin.changePercent24Hr);

        return (
            coin.name.toLowerCase().includes(searchText.toLowerCase()) &&
            Math.round(Number(price) * 100) / 100 !== 0 &&
            marketCap !== 0 &&
            changePercent !== 0 &&
            !isNaN(price) &&
            !isNaN(marketCap) &&
            !isNaN(changePercent)
        );
    });

    const handleRowClick = (record: Coin) => {
        navigate(`/coin/${record.id}`);
    };

    const handleOpenAddModal = (record: Coin, e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent row click from firing
        dispatch(setQuantity(1));
        dispatch(setSelectedCoin(record)); // Set the selected coin in the Redux store
        dispatch(showQuantityModal());
    };

    const handleCloseAddModal = () => {
        dispatch(clearSelectedCoin()); // Clear the selected coin in the Redux store
        dispatch(hideQuantityModal());
    };

    const handleAddToPortfolio = () => {
        if (selectedCoin && quantity > 0) {
            dispatch(addCoin({
                coin: selectedCoin,
                quantity,
            }));
            dispatch(hideQuantityModal());
        }
    };

    const columns: ColumnsType<Coin> = [
        {
            title: 'Символ',
            dataIndex: 'symbol',
            key: 'symbol',
            sorter: (a, b) => a.symbol.localeCompare(b.symbol),
        },
        {
            title: 'Логотип',
            dataIndex: 'logo',
            key: 'logo',
            render: (text: string, record: Coin) => (
                <img src={`https://assets.coincap.io/assets/icons/${record.symbol.toLowerCase()}@2x.png`} alt={record.symbol} width="30" />
            ),
        },
        {
            title: 'Цена (USD)',
            dataIndex: 'priceUsd',
            key: 'priceUsd',
            render: (text: string) => `$${parseFloat(text).toFixed(2)}`,
            sorter: (a, b) => parseFloat(a.priceUsd) - parseFloat(b.priceUsd),
        },
        {
            title: 'Рыночная капитализация (USD)',
            dataIndex: 'marketCapUsd',
            key: 'marketCapUsd',
            render: (text: string) => `$${parseFloat(text).toFixed(2)}`,
            sorter: (a, b) => parseFloat(a.marketCapUsd) - parseFloat(b.marketCapUsd),
        },
        {
            title: 'Изменение за 24ч (%)',
            dataIndex: 'changePercent24Hr',
            key: 'changePercent24Hr',
            render: (text: string) => `${parseFloat(text).toFixed(2)}%`,
            sorter: (a, b) => parseFloat(a.changePercent24Hr) - parseFloat(b.changePercent24Hr),
        },
        {
            title: 'Добавить в портфель',
            key: 'ButtonAdd',
            render: (text: string, record: Coin) => (
                <Button onClick={(e) => handleOpenAddModal(record, e)}>Add</Button>
            ),
        },
    ];

    return (
        <div className={styles.coinTable}>
            <Input.Search
                className={styles.search}
                placeholder="Поиск по названию монеты"
                enterButton="Поиск"
                onSearch={(value) => dispatch(setSearchText(value))}
            />
            {filteredData ? (
                <>
                    <Table
                        columns={columns}
                        dataSource={filteredData}
                        rowKey="id"
                        pagination={{ pageSize: 10 }}
                        className={styles.table}
                        onRow={(record) => ({
                            onClick: () => handleRowClick(record),
                        })}
                    />
                    <Modal
                        title={`Добавить ${selectedCoin?.name || ''} в портфель`}
                        visible={quantityModalVisible}
                        onCancel={handleCloseAddModal}
                        footer={[
                            <Button key="cancel" onClick={handleCloseAddModal}>
                                Отмена
                            </Button>,
                            <Button key="add" type="primary" onClick={handleAddToPortfolio}>
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
                        />
                    </Modal>
                </>
            ) : (
                <Alert message="Нет данных" description="Данные для отображения отсутствуют." type="info" showIcon />
            )}
        </div>
    );
};

export default CoinTable;
