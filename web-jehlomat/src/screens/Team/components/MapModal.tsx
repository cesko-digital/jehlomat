import React from 'react';
import Modal from 'Components/Modal/Modal';

interface ModalProps {
    open: boolean;
    close: any;
    children?: React.ReactNode;
}

/* Go to page on mobile, show modal on desktop */
export const MapModal: React.FC<any> = (props: React.PropsWithChildren<ModalProps>) => {

    return (

        <Modal modalHeaderText={'Území týmu'} open={props.open} onClose={props.close}>
            {props.children}
        </Modal>

    );
};

export default MapModal;
