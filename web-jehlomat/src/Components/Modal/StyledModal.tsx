import { FC } from 'react';
import { useMediaQuery } from '@mui/material';
import styled from '@emotion/styled';
import { white } from '../../utils/colors';
import { media } from '../../utils/media';
import { Dialog } from '@mui/material';
import ModalTitleBar from '../../Components/Navigation/ModalTitleBar';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import CloseIcon from '@mui/icons-material/Close';
import { useHistory } from 'react-router-dom';

interface Props {
    openModal: boolean;
    toggleModal: () => void;
    modalHeaderText?: string;
}

const ModalWrapper = styled.div<{ mobile?: boolean }>`
    position: static;
    width: 600px;
    height: 530px;
    overflow: hidden;
    ${props =>
        props.mobile &&
        `
        background: ${white};
        height: 100%;
        width: 100%;
        display: flex;
        position: absolute;
        flex-direction: column;
    `}
`;

const ModalBody = styled.div<{ mobile?: boolean }>`
    padding-top: 50px;
    height: 100%;
`;

const StyledModal: FC<Props> = ({ children, modalHeaderText, openModal, toggleModal }) => {
    const isMobile = useMediaQuery(media.lte('mobile'));
    let history = useHistory();

    const handleClose = () => {
        toggleModal();
        history.goBack();
    };

    return (
        <>
            {isMobile ? 
                <ModalWrapper mobile>
                    <ModalTitleBar
                        icon={<ChevronLeft sx={{ color: white, fontSize: 40 }} />}
                        mobile
                        onIconClick={() => {handleClose()}}
                    >
                        {modalHeaderText}
                    </ModalTitleBar>

                    <ModalBody mobile>{children}</ModalBody>
                </ModalWrapper>

                :

                <Dialog
                    open={openModal}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                    style={{display:'flex', flexDirection: 'column', alignItems:'center', justifyContent:'center'}}
                >
                    <ModalWrapper>
                        <ModalTitleBar
                            icon={<CloseIcon sx={{ color: white, fontSize: 25}} />}
                            isCentered
                            onIconClick={() => { handleClose()}}
                        >
                            {modalHeaderText}
                        </ModalTitleBar>

                        <ModalBody>{children}</ModalBody>
                    </ModalWrapper>
                </Dialog>
            }
        </>
    );
};

export default StyledModal;
