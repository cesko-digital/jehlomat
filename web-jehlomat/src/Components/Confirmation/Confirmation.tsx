import { FC } from 'react';
import { useMediaQuery } from '@mui/material';
import styled from '@emotion/styled';
import { media } from '../../utils/media';
import MuiModal, { ModalProps } from '@mui/material/Modal';
import { primary, white } from 'utils/colors';

interface Props extends Pick<ModalProps, 'open'> {
    open: boolean;
}

const ModalWrapper = styled.div`
    outline: none;
`;

const ModalContent = styled.div<{ mobile?: boolean }>`
    background: ${white};
    color: ${primary};
    height: 100vh;
    width: 100vw;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 6rem 1rem;
    box-sizing: border-box;
    text-align: center;

    span {
        display: block;
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

const Confirmation: FC<Props> = ({ open, children }) => {
    const isMobile = useMediaQuery(media.lte('mobile'));

    return (
        <>
            <MuiModal
                open={open}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
            >
                <ModalWrapper>
                    <ModalContent mobile={isMobile}>{children}</ModalContent>
                </ModalWrapper>
            </MuiModal>
        </>
    );
};

export default Confirmation;
