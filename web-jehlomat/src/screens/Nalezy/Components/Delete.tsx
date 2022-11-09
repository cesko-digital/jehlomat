import React, { FunctionComponent, useCallback, useState } from 'react';
import { styled } from '@mui/system';
import { Box } from '@mui/material';
import { AxiosResponse } from 'axios';
import { API } from 'config/baseURL';
import Modal from 'Components/Modal/Modal';
import PrimaryButton from 'Components/Buttons/PrimaryButton/PrimaryButton';
import { Syringe } from 'screens/Nalezy/types/Syringe';

import { ReactComponent as DeleteIcon } from 'assets/icons/delete-bin-line.svg';
import { useSetRecoilState } from 'recoil';
import { filteringState } from '../store';

const Link = styled('a')({
    alignItems: 'center',
    borderRadius: 0,
    boxSizing: 'border-box',
    color: 'rgba(220, 53, 69, 1) !important',
    cursor: 'pointer',
    display: 'flex',
    fontSize: '0.825rem',
    height: 44,
    justifyContent: 'space-between',
    padding: '0 12px',
    textDecoration: 'none',
    transition: 'all 300ms',

    '&:hover': {
        background: 'rgba(220, 53, 69, 0.075)',
        color: 'rgba(220, 53, 69, 1)',
    },

    svg: {
        display: 'inline-block',
        fill: 'rgba(220, 53, 69, 1)',
    },
});

const DangerButton = styled(PrimaryButton)({
    background: 'rgba(220, 53, 69, 1)',
});

interface DeleteProps {
    syringe: Syringe;
}

const Delete: FunctionComponent<DeleteProps> = ({ syringe }) => {
    const [open, setOpen] = useState(false);

    const setFilter = useSetRecoilState(filteringState);

    const handleModalState = (event: React.MouseEvent<Element, MouseEvent>, state: boolean) => {
        event.stopPropagation();
        setOpen(state);
    };

    const handleConfirm = useCallback(
        (event: React.MouseEvent<HTMLButtonElement>) => {
            event.stopPropagation();
            API.delete(`/syringe/${syringe.id}`)
                .then((response: AxiosResponse) => {
                    if (response.status !== 200) throw new Error('Unable to delete syringe');

                    setOpen(false);
                    setFilter(state => ({ ...state }));
                })
                .catch(e => console.warn(e));
        },
        [setFilter, syringe],
    );

    return (
        <>
            <Link className="danger" onClick={event => handleModalState(event, true)}>
                <span>Smazat</span>
                <DeleteIcon style={{ width: '20px', height: '20px' }} />
            </Link>
            <Modal modalHeaderText="Potvrďte výmaz" open={open} onClose={(event) => handleModalState(event, false)}>
                <Box display="flex" flexDirection="column" justifyContent="center">
                    <Box mb={5} mx={5} sx={{textAlign: "center"}}>
                        Opravdu si přejete smazat nahlášený nález?
                    </Box>
                    <Box mx="auto" mb={2}>
                        <DangerButton type="button" text="Ano, smazat" onClick={handleConfirm} />
                    </Box>
                </Box>
            </Modal>
        </>
    );
};

export default Delete;
