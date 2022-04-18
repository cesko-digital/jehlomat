import { SContainer, SLinkContainer } from './FooterStyles';
import { FooterLogo } from './FooterLogo/FooterLogo';
import { FooterLink, FooterLinkType } from './FooterLink/FooterLink';
import { LINKS } from 'routes';

const JEHLOMAT_FACEBOOK_LINK = 'https://www.facebook.com/jehlomat.cz';

const FOOTER_LINKS = [
    {
        type: FooterLinkType.About,
        route: LINKS.ABOUT,
    },
    {
        type: FooterLinkType.FAQ,
        route: LINKS.FAQ,
    },
    {
        type: FooterLinkType.Contact,
        route: LINKS.CONTACT,
    },
    {
        type: FooterLinkType.Facebook,
        route: JEHLOMAT_FACEBOOK_LINK,
        external: true,
    },
];

export const Footer = () => {
    return (
        <SContainer>
            <FooterLogo />
            <SLinkContainer>
                {FOOTER_LINKS.map(data => (
                    <FooterLink key={data.type} {...data} />
                ))}
            </SLinkContainer>
        </SContainer>
    );
};
