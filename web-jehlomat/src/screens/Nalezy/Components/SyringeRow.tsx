import React, { FunctionComponent, useState } from 'react';
import { styled } from '@mui/system';
import { Syringe } from '../types/Syringe';
import dayjs from 'dayjs';
import { ReactComponent as EditIcon } from 'assets/icons/edit.svg';
import SyringeSvg from 'assets/images/syringe.svg';
import ListItemMenu from './ListItemMenu';
import RoundButton from './RoundButton';
import SyringeState from './SyringeState';
import SyringeDemolishDate from './SyringeDemolishDate';
import Row from './Row';

export const SyringeIcon = styled('div')({
    backgroundImage: `url(${SyringeSvg})`,
    width: 15,
    height: 27,
});

interface SyringeRowProps {
    syringe: Syringe;
}

const SyringeRow: FunctionComponent<SyringeRowProps> = ({ syringe }) => {
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [selected, setSelected] = useState<Array<Syringe>>([]);
    const [edit, setEdit] = useState<Syringe | null>();

    const handleOpenActions = (syringe: Syringe) => (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
        setEdit(syringe);
    };
    const handleSelect = (syringe: Syringe) => () => {
        setSelected(state => {
            const i = state.find(s => s.id === syringe.id);
            if (i) return [...state.filter(s => s.id !== syringe.id)];

            return [...state, syringe];
        });
    };

    const isSelected = (syringe: Syringe) => selected.some(s => s.id === syringe.id);

    return (
        <Row syringe={syringe}>
            <td>
                <SyringeIcon />
            </td>
            <td>Benešov</td>
            <td>Benešov - u hřiště</td>
            <td>{dayjs(syringe.createdAt * 1000).format('D. M. YYYY')}</td>
            <td>
                <SyringeDemolishDate syringe={syringe} />
            </td>
            <td>Magdalena</td>
            <td>
                <SyringeState syringe={syringe} />
            </td>
            <td>
                <RoundButton onClick={handleOpenActions(syringe)}>
                    <EditIcon />
                </RoundButton>
                <ListItemMenu open={Boolean(anchorEl) && edit?.id === syringe.id} anchorEl={anchorEl!} onClickAway={() => setAnchorEl(null)} />
            </td>
            <td>
                <input type="checkbox" checked={isSelected(syringe)} onChange={handleSelect(syringe)} />
            </td>
        </Row>
    );
};

export default SyringeRow;
