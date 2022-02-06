import { FC, useState } from 'react';
import { useMediaQuery } from '@mui/material';
import styled from '@emotion/styled';
import { white, primaryDark } from '../../utils/colors';
import { media } from '../../utils/media';
import AddButton from '../Buttons/AddButton/AddButton';
import TextButton from '../Buttons/TextButton/TextButton';
import { Modal } from '@mui/material';
import TitleBar from '../../Components/Navigation/TitleBar';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import CloseIcon from '@mui/icons-material/Close';

interface Props {
    buttonText: string;
    modalHeaderText?: string;
}

const ModalWrapper = styled.div<{ mobile?: boolean }>`
    background: ${white};
    height: 100%;
    display: flex;
    flex-direction: column;
    ${props =>
        !props.mobile &&
        `
        width: 600px;
        height: 531px;
        border-radius: 10px;
        overflow: hidden;
    `}
`;

const ModalBody = styled.div<{ mobile?: boolean }>`
    padding-top: 50px;
`;

const StyledModal: FC<Props> = ({ children, buttonText, modalHeaderText }) => {
    const isMobile = useMediaQuery(media.lte('mobile'));

    const [openModal, setOpenModal] = useState(false);

    const handleClose = () => {
        setOpenModal(false);
    };

    return (
        <>
            {isMobile ? (
                <AddButton style={{ marginLeft: '10px' }} onClick={() => setOpenModal(true)} />
            ) : (
                <TextButton text={buttonText} style={{ marginLeft: '10px', color: `${primaryDark}` }} onClick={() => setOpenModal(true)} />
            )}

            <Modal
                open={openModal}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: `${white}` }}
            >
                <ModalWrapper mobile={isMobile}>
                    <TitleBar
                        icon={isMobile ? <ChevronLeft sx={{ color: white, fontSize: 40 }} /> : <CloseIcon sx={{ color: white, fontSize: 40 }} />}
                        onIconClick={() => {
                            setOpenModal(false);
                        }}
                    >
                        {modalHeaderText}
                    </TitleBar>

                    <ModalBody mobile={isMobile}>{children}</ModalBody>
                </ModalWrapper>
            </Modal>
        </>
    );
};

export default StyledModal;
