import { FC } from 'react';
import { greyLight } from '../../utils/colors';
import { UserCount } from './styled';
import { IUser } from 'types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { useHistory } from 'react-router';
import { useMediaQuery } from '@mui/material';
import { media } from 'utils/media';
import TabulkaUzivatelu from './TabulkaUzivatelu';
import { Table, TableRow } from 'Components/TableComponents/TableComponents';

interface IProps {
    users: IUser[];
}

const Uzivatele: FC<IProps> = ({ users }) => {
    const history = useHistory();
    const isMobile = useMediaQuery(media.lte('mobile'));

    if (isMobile) {
        return (
            <>
                <UserCount>uživatelů ({users.length})</UserCount>
                <Table className="mobile">
                    <tbody>
                        {users.map(user => (
                            <TableRow key={user.id}>
                                <td>
                                    {user.username}
                                    <br />
                                    <span className="second-row">{user.email}</span>
                                </td>
                                <td>
                                    <div onClick={e => history.push(`/uzivatel/upravit/${user.id}`)}>
                                        <FontAwesomeIcon icon={faPencilAlt as IconProp} size="1x" color={greyLight} />
                                    </div>
                                </td>
                            </TableRow>
                        ))}
                    </tbody>
                </Table>
            </>
        );
    }

    return <TabulkaUzivatelu users={users} />;
};

export default Uzivatele;
