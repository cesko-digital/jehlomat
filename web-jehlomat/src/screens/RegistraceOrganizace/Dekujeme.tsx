import { textSubTitles } from '../../utils/colors';
import { media } from '../../utils/media';
import { Typography, useMediaQuery } from '@mui/material';
import CheckIcon from '../../assets/icons/check.svg';
import { SCheckIcon } from './Dekujeme.styled';
import { OrganizationLayout, RegistrationStep } from '../../organisms/organization/OrganizationLayout';
import { Box } from '@mui/system';
import { MobileContainer, JehlomatLogo } from 'Components/MobileComponents/MobileComponents';

export default function Dekujeme() {
    const isMobile = useMediaQuery(media.lte('mobile'));

    function renderContent() {
        if (isMobile) {
            return (
                <MobileContainer>
                    <Typography maxWidth={190} mb={[10, 10]} variant="h5" textAlign="center" fontWeight="400">
                        Vaše organizace byla úspěšně zaregistrovaná!
                    </Typography>

                    <JehlomatLogo />

                    <SCheckIcon>
                        <img src={CheckIcon} alt="Jehlomat" />
                    </SCheckIcon>
                </MobileContainer>
            );
        }

        return (
            <Box display="flex" justifyContent="center" alignContent="center" flexDirection="column" gap={6} textAlign="center">
                <Typography maxWidth={500} variant="h3" color={textSubTitles} fontWeight="300">
                    Vaše registrace byla úspěšná!
                </Typography>

                <SCheckIcon>
                    <img src={CheckIcon} alt="Jehlomat" />
                </SCheckIcon>
            </Box>
        );
    }

    return <OrganizationLayout step={RegistrationStep.SUCCESS}>{renderContent()}</OrganizationLayout>;
}
