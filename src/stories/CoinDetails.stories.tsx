
import { Meta, StoryFn } from '@storybook/react';
import CoinDetails from '../components/CoinDetails';
import { Provider } from 'react-redux';
import { store } from '../redux/store';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

export default {
    title: 'CoinDetails',
    component: CoinDetails,
} as Meta;

const Template: StoryFn = (args) => (
    <Provider store={store}>
        <MemoryRouter initialEntries={['/coin/bitcoin']}>
            <Routes>
                <Route path="/coin/:id" element={<CoinDetails {...args} />} />
            </Routes>
        </MemoryRouter>
    </Provider>
);

export const Default = Template.bind({});
Default.args = {};
