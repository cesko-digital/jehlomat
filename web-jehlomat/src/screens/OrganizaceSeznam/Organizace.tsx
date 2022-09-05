import { useMediaQuery } from '@mui/material';
import { Table, TableRow } from 'Components/TableComponents/TableComponents';
import { FC } from 'react';
import { useHistory } from 'react-router';
import { IOrganizace } from 'types';
import { media } from 'utils/media';
import { Count } from './styled';
import TabulkaOrganizaci from './TabulkaOrganizaci';

interface IProps {
    organizations: IOrganizace[];
}

const Organizace: FC<IProps> = ({ organizations }) => {
    const history = useHistory();
    const isMobile = useMediaQuery(media.lte('mobile'));

    if (isMobile) {
        return (
            <>
                <Count>organizace ({organizations.length})</Count>
                <Table className="mobile">
                    <tbody>
                        {organizations.map(organization => (
                            <TableRow key={organization.id}>
                                <td>{organization.name}</td>
                                <td className="link" onClick={e => history.push(`/organizace/${organization.id}`)}>
                                    detail
                                </td>
                            </TableRow>
                        ))}
                    </tbody>
                </Table>
            </>
        );
    }

    return <TabulkaOrganizaci organizations={organizations} />;
};

export default Organizace;
