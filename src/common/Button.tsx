import React from 'react';
import { Button as AntdButton, ButtonProps } from 'antd';

const Button: React.FC<ButtonProps> = (props) => {
    return <AntdButton {...props}>{props.children}</AntdButton>;
};

export default Button;
