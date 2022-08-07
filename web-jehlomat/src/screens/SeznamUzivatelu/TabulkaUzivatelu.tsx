import { FC, useEffect, useState } from 'react';
import { greyLight } from '../../utils/colors';
import { TableRow, UsersTable } from './styled';
import { IOrganizace, ITeam, IUser } from 'types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { useHistory } from 'react-router';
import { AxiosResponse } from 'axios';
import apiURL from 'utils/api-url';
import { userState } from 'store/user';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import API from 'config/baseURL';
import { SortableColumn, sortingState, columnSortingDirection, sortUsers } from './store';
import { sort } from './helper';
import SortableHeading from 'screens/Nalezy/Components/SortableHeading';

interface IProps {
    users: IUser[];
}

const TabulkaUzivatelu: FC<IProps> = ({ users }) => {
    const history = useHistory();
    const loggedUser = useRecoilValue(userState);

    const sorting = useRecoilValue(sortingState);
    const setSort = useSetRecoilState(sortingState);
    const handleSort = (column: SortableColumn) => () => setSort(state => sort(state, column));

    const [teams, setTeams] = useState<ITeam[]>([]);
    const [organization, setOrganization] = useState<IOrganizace>();

    useEffect(() => {
        const loadData = async () => {
            if (loggedUser?.organizationId) {
                const organizationInfo: AxiosResponse<IOrganizace> = await API.get(apiURL.getOrganization(loggedUser.organizationId));
                setOrganization(organizationInfo.data);
                const teamsInOrganization: AxiosResponse<ITeam[]> = await API.get(apiURL.getTeamsInOrganization(loggedUser.organizationId));
                setTeams(teamsInOrganization.data);
            }
        };
        loadData();
    }, [loggedUser?.organizationId]);

    return (
        <UsersTable>
            <thead>
                <tr>
                    <th></th>
                    <th></th>
                    <th>
                        <SortableHeading direction={useRecoilValue(columnSortingDirection('username'))} onClick={handleSort('username')}>
                            Uživatelské jméno
                        </SortableHeading>
                    </th>
                    <th>Organizace</th>
                    <th>
                        <SortableHeading direction={useRecoilValue(columnSortingDirection('teamName'))} onClick={handleSort('teamName')}>
                            Tým
                        </SortableHeading>
                    </th>
                    <th>
                        <SortableHeading direction={useRecoilValue(columnSortingDirection('email'))} onClick={handleSort('email')}>
                            Kontakt
                        </SortableHeading>
                    </th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {sortUsers(users, teams, sorting).map(user => (
                    <TableRow key={user.id}>
                        <td>{user.id}</td>
                        <td></td>
                        <td>{user.username}</td>
                        <td>{organization?.name}</td>
                        <td>{teams.find(f => f.id === user.teamId)?.name}</td>
                        <td>{user.email}</td>
                        <td>
                            <div onClick={e => history.push(`/uzivatel/upravit/${user.id}`)}>
                                <FontAwesomeIcon icon={faPencilAlt as IconProp} size="1x" color={greyLight} />
                            </div>
                        </td>
                    </TableRow>
                ))}
            </tbody>
        </UsersTable>
    );
};

export default TabulkaUzivatelu;
