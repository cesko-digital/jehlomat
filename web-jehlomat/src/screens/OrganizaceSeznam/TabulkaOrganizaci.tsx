import { Table, TableRow } from 'Components/TableComponents/TableComponents';
import { FC } from 'react';
import { useHistory } from 'react-router';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import SortableHeading from 'screens/Nalezy/Components/SortableHeading';
import { IOrganizace } from 'types';
import { sort } from './helper';
import { columnSortingDirection, SortableColumn, sortingState, sortOrganizations } from './store';

interface IProps {
    organizations: IOrganizace[];
}

const TabulkaOrganizaci: FC<IProps> = ({ organizations }) => {
    const history = useHistory();

    const sorting = useRecoilValue(sortingState);
    const setSort = useSetRecoilState(sortingState);
    const handleSort = (column: SortableColumn) => () => setSort(state => sort(state, column));

    return (
        <Table>
            <thead>
                <tr>
                    <th>
                        {' '}
                        <SortableHeading direction={useRecoilValue(columnSortingDirection('name'))} onClick={handleSort('name')}>
                            Organizace
                        </SortableHeading>
                    </th>
                    <th>
                        <SortableHeading direction={useRecoilValue(columnSortingDirection('verified'))} onClick={handleSort('verified')}>
                            Stav
                        </SortableHeading>
                    </th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {sortOrganizations(organizations, sorting).map(organization => (
                    <TableRow key={organization.id}>
                        <td>{organization.name}</td>
                        <td>{organization.verified ? 'Schváleno' : 'Čeká na schválení'}</td>
                        <td className="link" onClick={e => history.push(`/organizace/${organization.id}`)}>
                            detail
                        </td>
                    </TableRow>
                ))}
            </tbody>
        </Table>
    );
};

export default TabulkaOrganizaci;
