import { FC } from 'react';
import { useMediaQuery } from '@mui/material';
import styled from '@emotion/styled';
import { white } from '../../utils/colors';
import { media } from '../../utils/media';
import Dialog, { DialogProps } from '@mui/material/Dialog';

type CloseFunction = () => void;

interface Props extends Pick<DialogProps, 'open'> {
    onClose: CloseFunction;
}

const DialogWrapper = styled.div`
    width: 570px;
    height: 400px;
    border-radius: 10px;
    overflow: hidden;
    background: ${white};
    height: 100%;
    display: flex;
    flex-direction: column;

    @media ${media.lte('mobile')} {
        width: 100%;
        height: 100%;
    }
`;

const DialogBody = styled.div`
    padding-top: 30px;

    @media ${media.lte('mobile')} {
        padding-top: 0px;
    }
`;

const DialogStyled: FC<Props> = ({ children, open, onClose }) => {
    const isMobile = useMediaQuery(media.lte('mobile'));

    const handleClose = () => {
        onClose();
    };

    return (
        <>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="dialog-dialog-title"
                aria-describedby="dialog-dialog-description"
                fullWidth
                maxWidth="xl"
                PaperProps={{
                    style: {
                        margin: '10px',
                        width: isMobile ? 'calc(100% - 30px)' : 'auto',
                        borderRadius: '40px',
                    },
                }}
            >
                <DialogWrapper>
                    <DialogBody>{children}</DialogBody>
                </DialogWrapper>
            </Dialog>
        </>
    );
};

export default DialogStyled;
