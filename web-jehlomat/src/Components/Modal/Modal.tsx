import { FC } from 'react';
import { useMediaQuery } from '@mui/material';
import styled from '@emotion/styled';
import { white } from '../../utils/colors';
import { media } from '../../utils/media';
import MuiModal, { ModalProps } from '@mui/material/Modal';
import TitleBar from '../../Components/Navigation/TitleBar';
import CloseIcon from '@mui/icons-material/Close';

type CloseFunction = () => void;

interface Props extends Pick<ModalProps, 'open'> {
    modalHeaderText?: string;
    onClose: CloseFunction;
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
        max-height: 531px;
        height: auto;
        padding-bottom: 20px;
        border-radius: 10px;
        overflow: hidden;
    `}
`;

const ModalBody = styled.div<{ mobile?: boolean }>`
    padding-top: 50px;
`;

const Modal: FC<Props> = ({ children, modalHeaderText, open, onClose }) => {
    const isMobile = useMediaQuery(media.lte('mobile'));

    return (
        <>
            <MuiModal
                open={open}
                onClose={onClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
            >
                <ModalWrapper mobile={isMobile}>
                    <TitleBar
                        icon={<CloseIcon sx={{ color: white, fontSize: 25 }} />}
                        onIconClick={() => {
                            onClose();
                        }}
                    >
                        {modalHeaderText}
                    </TitleBar>

                    <ModalBody mobile={isMobile}>{children}</ModalBody>
                </ModalWrapper>
            </MuiModal>
        </>
    );
};

export default Modal;
