import ConfirmationModal from 'Components/ConfirmationModal';
import { createContext, createRef, useContext } from 'react';
const ref = createRef<ConfirmationModal>();

export const ConfirmationModalContext = createContext(ref);

export const useConfirmationModalContext = () => {
    const ref = useContext(ConfirmationModalContext);
    return ref.current;
};
