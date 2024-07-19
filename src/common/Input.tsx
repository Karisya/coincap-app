import React from 'react';
import { Input as AntdInput, InputProps, InputNumber as AntdInputNumber, InputNumberProps } from 'antd';

export const Input: React.FC<InputProps> & { Search: typeof AntdInput.Search } = (props) => {
    return <AntdInput {...props} />;
};

Input.Search = AntdInput.Search;

export const InputNumber: React.FC<InputNumberProps> = (props) => {
    return <AntdInputNumber {...props} />;
};
