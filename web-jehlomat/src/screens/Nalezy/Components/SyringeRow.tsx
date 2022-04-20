import React, { FunctionComponent, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { styled } from '@mui/system';
import { Syringe } from 'screens/Nalezy/types/Syringe';
import ListItemMenu from 'screens/Nalezy/Components/ListItemMenu';
import RoundButton from 'screens/Nalezy/Components/RoundButton';
import SyringeState from 'screens/Nalezy/Components/SyringeState';
import SyringeDemolishDate from 'screens/Nalezy/Components/SyringeDemolishDate';
import Row from 'screens/Nalezy/Components/Row';
import Checkbox from 'screens/Nalezy/Components/Checkbox';

import { ReactComponent as EditIcon } from 'assets/icons/edit.svg';
import { ReactComponent as SyringeIcon } from 'assets/icons/syringe-line.svg';

interface SyringeRowProps {
    syringe: Syringe;
    selected: Syringe[];
    onSelect: (syringe: Syringe) => void;
    onUpdate: () => void;
}

const Right = styled('td')({
    textAlign: 'right',
});

const SyringeRow: FunctionComponent<SyringeRowProps> = ({ syringe, selected, onSelect, onUpdate }) => {
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [edit, setEdit] = useState<Syringe | null>();

    const handleSelect = () => onSelect(syringe);
    const handleOpenActions = (syringe: Syringe) => (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
        setEdit(syringe);
    };
    const handleUpdate = () => {
        onUpdate();
        setAnchorEl(null);
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
                <ListItemMenu open={Boolean(anchorEl) && edit?.id === syringe.id} anchorEl={anchorEl!} onClickAway={() => setAnchorEl(null)} syringe={syringe} onUpdate={handleUpdate} />
            </Right>
            <Right>
                <Checkbox checked={isSelected} onChange={handleSelect} size="small" />
            </Right>
        </Row>
    );
};

export default SyringeRow;
