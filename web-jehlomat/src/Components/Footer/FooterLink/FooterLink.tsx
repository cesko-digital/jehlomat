import { FC, ReactNode, useCallback } from 'react';
import * as s from './FooterLinkStyles';
import { useHistory } from 'react-router-dom';
import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';

export enum FooterLinkType {
    About,
    Contact,
    FAQ,
    Facebook,
}

export interface IFooterLink {
    type: FooterLinkType;
    route: string;
    external?: boolean;
}

const TEXT__ABOUT = 'O Jehlomatu';
const TEXT__FAQ = 'FAQ';
const TEXT__CONTACT = 'Kontakt';

export const FooterLink: FC<IFooterLink> = ({ type, route, external }) => {
    const history = useHistory();

    const handleClick = useCallback(() => {
        if (external) {
            window.location.href = route;
        } else {
            history.push(route);
        }
    }, [route, history, external]);

    return (
        <s.Container onClick={handleClick}>
            <s.Link>{titleForType(type)}</s.Link>
        </s.Container>
    );
};

function titleForType(type: FooterLinkType): ReactNode {
    switch (type) {
        case FooterLinkType.About:
            return TEXT__ABOUT;
        case FooterLinkType.FAQ:
            return TEXT__FAQ;
        case FooterLinkType.Contact:
            return TEXT__CONTACT;
        case FooterLinkType.Facebook:
            return <FacebookOutlinedIcon />;
    }
}
