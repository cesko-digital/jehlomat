import styled from '@emotion/styled';
import { textSubTitles, white } from '../../utils/colors';
import { media } from '../../utils/media';
import { useMediaQuery } from '@mui/material';
import { OrganizationLayout, RegistrationStep } from '../../organisms/organization/OrganizationLayout';
import { Box } from '@mui/system';
import { MobileContainer, JehlomatLogo } from '../../Components/MobileComponents/MobileComponents';

const Title = styled.h3`
    font-size: 48px;
    font-weight: 300;
    line-height: 56px;
    letter-spacing: 0em;
    text-align: center;
    color: ${textSubTitles};
`;

const InfoText = styled.p`
    font-size: 24px;
    line-height: 28px;
    max-width: 500px;
    text-align: center;
    color: ${textSubTitles};
    letter-spacing: 0em;
    font-weight: 300;

    @media ${media.lte('mobile')} {
        color: ${white};
        font-weight: 400;
    }
`;

const Text = () => (
    <>
        <InfoText>Nyní Vaší registraci schválíme. Pro vaši bezpečnost schvalujeme každou organizaci ručně. Může nám to chvíli trvat.</InfoText>
        <InfoText>Po schválení dostanete potvrzovací e-mail.</InfoText>
        <InfoText>Děkujeme za trpělivost!</InfoText>
    </>
);

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
