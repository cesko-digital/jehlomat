import React, { Children, useCallback, useState } from 'react';
import { useMediaQuery } from '@mui/material';
import { media } from 'utils/media';
import Modal from 'Components/Modal/Modal';

interface ModalProps {
    open: boolean;
    close: any;
    children?: React.ReactNode;
}

export const ConfirmModal: React.FC<any> = (props: React.PropsWithChildren<ModalProps>) => {

    return (
        <>
                <Modal modalHeaderText={'Založení teamu'} open={props.open} onClose={props.close} >
                    {props.children}
                </Modal>
        </>
    );
};

export default ConfirmModal;
