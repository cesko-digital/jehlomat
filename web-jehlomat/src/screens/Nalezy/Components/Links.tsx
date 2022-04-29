import React, { FunctionComponent } from 'react';
import { styled } from '@mui/system';
import { Syringe } from 'screens/Nalezy/types/Syringe';
import ActionLink from 'screens/Nalezy/Components/ActionLink';
import Delete from 'screens/Nalezy/Components/Delete';

import { ReactComponent as SyringeIcon } from 'assets/icons/syringe-line.svg';
import { ReactComponent as EditIcon } from 'assets/icons/pencil-line.svg';

const List = styled('ul')({
    margin: 0,
    padding: 0,
    listStyle: 'none',

    li: {
        borderBottom: '1px solid #dee2e6',
        marginLeft: 12,
        marginRight: 12,

        '&:last-child': {
            borderBottom: 'none',
        },
    },
});

interface LinksProps {
    syringe: Syringe;
}

const Links: FunctionComponent<LinksProps> = ({ syringe }) => (
    <List>
        <li>
            <ActionLink to="/">
                <span>Zlikvidovat nález</span>
                <SyringeIcon style={{ width: '20px', height: '20px' }} />
            </ActionLink>
        </li>
        <li>
            <ActionLink to="/">
                <span>Upravit</span>
                <EditIcon style={{ width: '20px', height: '20px' }} />
            </ActionLink>
        </li>
        <li>
            <Delete syringe={syringe} />
        </li>
    </List>
);

export default Links;
