export interface CoinDetailsProps { }

export type ChartOptions = 'day' | '12hours' | '1hour';

export interface Coin {
    id: string;
    symbol: string;
    name: string;
    priceUsd: string;
    marketCapUsd: string;
    changePercent24Hr: string;
}