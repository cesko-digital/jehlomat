import { FC } from 'react';
import { useMediaQuery } from '@mui/material';
import styled from '@emotion/styled';
import { primaryDark, white } from '../../utils/colors';
import { media } from '../../utils/media';
import MuiModal, { ModalProps } from '@mui/material/Modal';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';

type CloseFunction = () => void;

interface Props extends Pick<ModalProps, 'open'> {
    newStatus: string;
    onClose: CloseFunction;
}

const ModalWrapper = styled.div`
    position: relative;
    outline: none;
`;

const CloseButton = styled(IconButton)`
    width: 56px;
    height: 56px;
    position: absolute;
    top: 0;
    right: 0;

    :hover {
        cursor: pointer;
    }
`;

const ModalContent = styled.div<{ mobile?: boolean }>`
    background: ${primaryDark};
    color: ${white};
    height: 100vh;
    width: 100vw;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem;
    box-sizing: border-box;
    text-align: center;

    span {
        display: block;
    }

    .text {
        font-size: 1.5rem;
        font-weight: 300;
    }

    .title {
        font-size: 3rem;
        margin: 4rem 0;
    }

    .newStatus {
        text-transform: uppercase;
        font-size: 3rem;
        font-weight: 300;
        margin: 2.5rem 0;
    }

    ${props =>
        !props.mobile &&
        `
        width: 600px;
        max-height: 531px;
        height: auto;
        border-radius: 10px;
        overflow: hidden;
    `}
`;

const Modal: FC<Props> = ({ open, onClose, children }) => {
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
                <ModalWrapper>
                    <CloseButton onClick={onClose} aria-label="Zpět">
                        <CloseIcon sx={{ color: white, fontSize: 25 }} />
                    </CloseButton>
                    <ModalContent mobile={isMobile}>{children}</ModalContent>
                </ModalWrapper>
            </MuiModal>
        </>
    );
};

export default Modal;
