import { FC } from 'react';
import * as s from './HeaderMobileStyles';
import { HeaderLogo } from './HeaderLogo/HeaderLogo';
import SecondaryButton from '../Buttons/SecondaryButton/SecondaryButton';
import { HeaderLink, HeaderLinkType } from './HeaderLink/HeaderLink';
import TextButton from '../Buttons/TextButton/TextButton';

export const HeaderMobile: FC = () => {
    return (
        <s.Container>
            <s.LogoContainer>
                <HeaderLogo mobile={true} />
            </s.LogoContainer>
            <s.Title>Monitorovací a analytický nástroj ochrany veřejného zdraví</s.Title>
            <s.ButtonContainer>
                <SecondaryButton text={'Přihlášení'} />
            </s.ButtonContainer>
            <s.LinkContainer>
                <HeaderLink type={HeaderLinkType.CreateOrgAccount} route={'create'} mobile={true} />
                <s.LineVertical />
                <HeaderLink type={HeaderLinkType.Watch} route={'create'} mobile={true} />
            </s.LinkContainer>
            <s.LineHorizontal />

            <div>Našli jste jehlu a nevíte, co s ní?</div>

            <div>
                <TextButton text={'Anonymní přístup'} />
            </div>
        </s.Container>
    );
};
