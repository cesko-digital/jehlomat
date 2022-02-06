import { FC } from 'react';
import * as s from './HeaderMobileStyles';
import { HeaderLogo } from './HeaderLogo/HeaderLogo';
import SecondaryButton from '../Buttons/SecondaryButton/SecondaryButton';
import { HeaderLink, HeaderLinkType } from './HeaderLink/HeaderLink';
import TextButton from '../Buttons/TextButton/TextButton';
import { LINKS } from 'routes';
import { Link } from 'react-router-dom';

export const HeaderMobile: FC = () => {
    return (
        <s.Container>
            <s.LogoContainer>
                <HeaderLogo mobile={true} />
            </s.LogoContainer>
            <s.Title>nástroj pro hlášení a likvidaci injekčních stříkaček</s.Title>
            <s.ButtonContainer>
                <SecondaryButton>
                    <Link to={LINKS.LOGIN}>Přihlášení</Link>
                </SecondaryButton>
            </s.ButtonContainer>
            <s.LinkContainer>
                <HeaderLink type={HeaderLinkType.CreateOrgAccount} route={LINKS.ORGANIZATION} mobile={true} />
                <s.LineVertical />
                <HeaderLink type={HeaderLinkType.Watch} route={LINKS.TRACKING_FIND} mobile={true} />
            </s.LinkContainer>
            <s.LineHorizontal />

            <div>
                <TextButton text={'Našli jste jehlu a nevíte, co s ní?'} />
            </div>
            <div>
                <TextButton text={'Zadat nález anonymně'} />
            </div>
        </s.Container>
    );
};
