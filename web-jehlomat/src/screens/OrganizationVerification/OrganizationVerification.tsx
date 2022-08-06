import CheckCircle from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { secondary, darkGrey, greyLight } from '../../utils/colors';
import { useCallback, useEffect, useState } from 'react';
import { Content } from './Content';
import { AxiosResponse } from 'axios';
import { isStatusSuccess, isStatusNoPermission, isStatusNoContent, isStatusNotFound } from 'utils/payload-status';
import { useHistory, useParams } from 'react-router';
import apiURL from 'utils/api-url';
import { useRecoilValue } from 'recoil';
import { tokenState } from 'store/login';
import API from 'config/baseURL';
import _ from 'lodash';

interface IVerification {
    code?: string;
    userId?: string;
    children?: React.ReactNode;
}

export interface IContentData {
    text: string;
    icon: {
        Component: typeof CancelIcon | typeof CheckCircle;
        color: {
            mobile: string;
            desktop: string;
        };
    };
}

interface IRouteParams {
    orgId: string;
}

const OrganizationVerification = (props: IVerification) => {
    const [contentData, setContentData] = useState<IContentData | null>(null);
    const { orgId } = useParams<IRouteParams>();
    const history = useHistory();
    const token = useRecoilValue(tokenState);

    const isAdminVerification: boolean = props.code && props.userId ? true : false;

    const CONTENT_DATA__SUCCESS: IContentData = {
        text: isAdminVerification ? 'Děkujeme za potvrzení. Niní se můžete příhlásit' : 'Organizace byla úspěšně schválena!',
        icon: {
            Component: CheckCircle,
            color: {
                mobile: secondary,
                desktop: secondary,
            },
        },
    };

    const CONTENT_DATA__NO_PERMISSION: IContentData = {
        text: 'Pro tuto akci nemáte oprávnění',
        icon: {
            Component: CancelIcon,
            color: {
                mobile: greyLight,
                desktop: darkGrey,
            },
        },
    };

    const CONTENT_DATA__NOK: IContentData = {
        text: isAdminVerification ? 'Potvrzení administrátora organizace bylo neúspěšné' : 'Organizace nebyla nalezena',
        icon: {
            Component: CancelIcon,
            color: {
                mobile: greyLight,
                desktop: darkGrey,
            },
        },
    };

    const handleOrganizationConfirm = useCallback(async () => {
        if (token) {
            const response: AxiosResponse = isAdminVerification
                ? await API.post(apiURL.postAdminOrganizationVerification(), { userId: props.userId, code: props.code })
                : await API.get(apiURL.getOrganizationVerification(orgId));
            const status = response.status;

            let contentDataToSet = null;
            if (isStatusSuccess(status)) {
                contentDataToSet = CONTENT_DATA__SUCCESS;
            } else if (isStatusNoPermission(status)) {
                contentDataToSet = CONTENT_DATA__NO_PERMISSION;
            } else if (isStatusNoContent(status) || isStatusNotFound(status)) {
                contentDataToSet = CONTENT_DATA__NOK;
            } else {
                history.push('/error');
                return;
            }

            if (contentDataToSet) {
                setContentData(contentDataToSet);
            }
        } else {
            history.push('/error');
        }
    }, [orgId, history, token]);

    useEffect(() => {
        handleOrganizationConfirm();
    }, []);

    return <Content contentData={contentData}>{_.isEqual(contentData, CONTENT_DATA__SUCCESS) ? props.children : null}</Content>;
};

export default OrganizationVerification;
