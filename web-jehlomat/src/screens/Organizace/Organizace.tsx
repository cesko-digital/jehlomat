import { useMediaQuery } from '@mui/material';
import { FC, useCallback, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import { useRecoilValue } from 'recoil';
import { ORGANIZATION_URL_PATH } from 'routes';
import { tokenState } from 'store/login';
import { media } from 'utils/media';
import { OrganisationNotFound } from './404';
import { DesktopContent } from './DesktopContent';
import { MobileContent } from './MobileContent';
import { IData, TErrorCallback, useOrganisation } from './use-organisation';

interface IRouteParams {
    orgId?: string;
}

const Organizace: FC = () => {
    const [notFound, setNotFound] = useState(false);
    const [data, setData] = useState<IData>();
    const token = useRecoilValue(tokenState);
    const history = useHistory();
    const isMobile = useMediaQuery(media.lte('mobile'));
    const { orgId } = useParams<IRouteParams>();

    const handleError: TErrorCallback = useCallback((errorType) => {
        if (errorType === "not-found") {
            setNotFound(true);
        }
    }, []);

    const getOrganisation = useOrganisation(handleError);

    useEffect(() => {
        async function fetchMyAPI() {
            if (token) {
                const newData = await getOrganisation(orgId);
                setData(newData);
            }
        }
        fetchMyAPI();
    }, []);

    const handleEditClick = useCallback(() => {
        history.push(`/${ORGANIZATION_URL_PATH}/edit/${data?.organisation.id}`);
    }, [history, data]);

    if (notFound) {
        return <OrganisationNotFound/>
    }

    if (!data) {
        return null;
    }

    return isMobile ? <MobileContent onEditClick={handleEditClick} data={data} /> : <DesktopContent onEditClick={handleEditClick} data={data} />;
};

export default Organizace;
