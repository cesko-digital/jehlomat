import styled from '@emotion/styled';
import { textSubTitles, white } from '../../utils/colors';
import { media } from '../../utils/media';
import { useMediaQuery } from '@mui/material';
import { OrganizationLayout, RegistrationStep } from '../../organisms/organization/OrganizationLayout';
import { Box } from '@mui/system';
import { MobileContainer, JehlomatLogo } from './components/MobileComponents';

const Title = styled.h3`
    font-size: 48px;
    font-weight: 300;
    line-height: 56px;
    letter-spacing: 0em;
    text-align: center;
    color: ${textSubTitles};
`;

interface WithIsMobile {
    isMobile: boolean;
}

const InfoText = styled.p<WithIsMobile>`
    font-size: 24px;
    line-height: 28px;
    max-width: 500px;
    text-align: center;
    color: ${textSubTitles};
    letter-spacing: 0em;
    font-weight: 300;

    ${props =>
        props.isMobile &&
        `
        color: ${white};
        font-weight: 400;
    `}
`;

const Text = () => {
    const isMobile = useMediaQuery(media.lte('mobile'));

    return (
        <>
            <InfoText isMobile={isMobile}>Nyní Vaší registraci schválíme. Pro vaši bezpečnost schvalujeme každou organizaci ručně. Může nám to chvíli trvat.</InfoText>
            <InfoText isMobile={isMobile}>Po schválení dostanete potvrzovací e-mail.</InfoText>
            <InfoText isMobile={isMobile}>Děkujeme za trpělivost!</InfoText>
        </>
    );
};

export default function CekaniNaSchvaleni() {
    const isMobile = useMediaQuery(media.lte('mobile'));

    function renderContent() {
        if (isMobile) {
            return (
                <MobileContainer>
                    <JehlomatLogo />

                    <Text />
                </MobileContainer>
            );
        }

        return (
            <Box display="flex" justifyContent="center" alignContent="center" flexDirection="column" textAlign="center" sx={{ mb: 16 }}>
                <Title>Děkujeme!</Title>

                <Text />
            </Box>
        );
    }

    return <OrganizationLayout step={RegistrationStep.VERIFY}>{renderContent()}</OrganizationLayout>;
}
