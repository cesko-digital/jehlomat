import { FC, useState } from 'react';
import StyledModal from '../../Components/Modal/StyledModal';
import PridatUzivateleForm from 'Components/Form/PridatUzivateleForm';

interface Props {}

const PridatUzivatele: FC<Props> = () => {
    const [openModal, setOpenModal] = useState(true);

    const toggleModal = () => {
        setOpenModal(!openModal);
    }

    return (
        <>
            <StyledModal
                openModal={openModal}
                toggleModal={toggleModal}
                modalHeaderText="Přidat uživatele"
            >
                <PridatUzivateleForm />
            </StyledModal>
        </>
    );
};

export default PridatUzivatele;
