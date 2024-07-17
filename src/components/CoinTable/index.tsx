import React, { useEffect } from 'react';
import { Table, Button, Spin, Alert, Input } from 'antd';
import { useGetCoinsQuery } from '../../api/coinApi';
import { ColumnsType } from 'antd/lib/table';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store';
import { setSearchText } from '../../redux/reducers/searchTextSlice';
import { useNavigate } from 'react-router-dom';
import styles from './index.module.scss'

interface Coin {
    id: string;
    symbol: string;
    name: string;
    priceUsd: string;
    marketCapUsd: string;
    changePercent24Hr: string;
}

const CoinTable: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const searchText = useSelector((state: RootState) => state.search.searchText);
    const { data, error, isLoading } = useGetCoinsQuery('https://api.coincap.io/v2/assets');
    const navigate = useNavigate();

    useEffect(() => {
        if (data) {
            console.log(data);
        }
    }, [data]);

    if (isLoading) return <Spin size="large" />;
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
            dataIndex: 'ButtonAdd',
            key: 'ButtonAdd',
            render: (text: string, record: Coin) => (
                <Button>Add</Button>
            ),
        },
    ];

    return (
        <div className={styles.coinTable} >
            <Input.Search
                className={styles.search}
                placeholder="Поиск по названию монеты"
                enterButton="Поиск"
                onSearch={(value) => dispatch(setSearchText(value))}

            />
            {filteredData ? (
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
            ) : (
                <Alert message="Нет данных" description="Данные для отображения отсутствуют." type="info" showIcon />
            )}
        </div>
    );
};

export default CoinTable;