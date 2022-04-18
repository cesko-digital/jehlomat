import ConfirmationModal from 'Components/ConfirmationModal';
import { ConfirmationModalContext } from 'context/confirmation-modal-context';
import { ReactNode, RefObject } from 'react';

interface IProps {
    modalRef: RefObject<ConfirmationModal>;
    children: ReactNode;
}

export const ConfirmationModalProvider = ({ children, modalRef }: IProps) => {
    return <ConfirmationModalContext.Provider value={modalRef}>{children}</ConfirmationModalContext.Provider>;
};
