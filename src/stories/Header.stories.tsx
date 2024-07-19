import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import Header from '../components/Header';
import { store } from '../redux/store';
import { Provider } from 'react-redux';

export default {
    title: 'Components/Header',
    component: Header,
} as Meta;

const Template: StoryFn = (args) => (
    <Provider store={store} >
    <Header {...args} />
</Provider>);

export const Default = Template.bind({});
