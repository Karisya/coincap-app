import React from 'react';
import { Modal as AntdModal, ModalProps } from 'antd';

const Modal: React.FC<ModalProps> = (props) => {
    return <AntdModal {...props}>{props.children}</AntdModal>;
};

export default Modal;
