import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const coinApi = createApi({
    reducerPath: 'coinApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'https://api.coincap.io/v2/' }),
    endpoints: (builder) => ({
        getCoins: builder.query({
            query: () => 'assets',
        }),
        getCoinById: builder.query({
            query: (id) => `assets/${id}`,
        }),
    }),
});

export const { useGetCoinsQuery, useGetCoinByIdQuery } = coinApi;