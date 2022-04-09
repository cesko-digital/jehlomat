import React, { FunctionComponent, useMemo, useState } from 'react';
import { Syringe } from '../types/Syringe';
import dayjs from 'dayjs';
import { ReactComponent as EditIcon } from 'assets/icons/edit.svg';
import { ReactComponent as SyringeIcon } from 'assets/icons/syringe-line.svg';
import ListItemMenu from './ListItemMenu';
import RoundButton from './RoundButton';
import SyringeState from './SyringeState';
import SyringeDemolishDate from './SyringeDemolishDate';
import Row from './Row';
import Checkbox from './Checkbox';
import { styled } from '@mui/system';

interface SyringeRowProps {
    syringe: Syringe;
    selected: Syringe[];
    onSelect: (syringe: Syringe) => void;
}

const Right = styled('td')({
    textAlign: 'right',
});

const SyringeRow: FunctionComponent<SyringeRowProps> = ({ syringe, selected, onSelect }) => {
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [edit, setEdit] = useState<Syringe | null>();

    const handleSelect = () => onSelect(syringe);
    const handleOpenActions = (syringe: Syringe) => (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
        setEdit(syringe);
    };

    const isSelected = useMemo(() => selected.some(s => s.id === syringe.id), [selected]);

    return (
        <Row syringe={syringe}>
            <td>
                <SyringeIcon />
            </td>
            <td>{syringe.location.obec}</td>
            <td>{syringe.location.mestkaCast}</td>
            <td>{dayjs(syringe.createdAt * 1000).format('D. M. YYYY')}</td>
            <td>
                <SyringeDemolishDate syringe={syringe} />
            </td>
            <td>{syringe.createdBy.username}</td>
            <td>
                <SyringeState syringe={syringe} />
            </td>
            <Right>
                <RoundButton onClick={handleOpenActions(syringe)}>
                    <EditIcon />
                </RoundButton>
                <ListItemMenu open={Boolean(anchorEl) && edit?.id === syringe.id} anchorEl={anchorEl!} onClickAway={() => setAnchorEl(null)} />
            </Right>
            <Right>
                <Checkbox checked={isSelected} onChange={handleSelect} size="small" />
            </Right>
        </Row>
    );
};

export default SyringeRow;
