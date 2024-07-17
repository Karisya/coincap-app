import { Meta, StoryObj } from '@storybook/react';
import CoinTable from '../components/CoinTable';
import { Provider } from 'react-redux';
import { store } from '../redux/store';

export default {
    title: 'CoinTable',
    component: CoinTable,
} as Meta;

const Template: StoryObj = (args) => (
    <Provider store={store} >
        <CoinTable {...args} />
    </Provider>
);

export const Default = Template.bind({});