import { Meta, StoryFn } from '@storybook/react';
import CoinTable from '../components/CoinTable';
import { Provider } from 'react-redux';
import { store } from '../redux/store';
import { BrowserRouter as Router } from 'react-router-dom';

export default {
    title: 'CoinTable',
    component: CoinTable,
} as Meta;

const Template: StoryFn = (args) => (
    <Provider store={store}>
        <Router>
            <CoinTable {...args} />
        </Router>
    </Provider>
);

export const Default = Template.bind({});
Default.args = {};
