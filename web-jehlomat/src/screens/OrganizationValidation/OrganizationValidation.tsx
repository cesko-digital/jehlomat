import { Box, Typography, useMediaQuery } from '@mui/material';
import PrimaryButton from 'Components/Buttons/PrimaryButton/PrimaryButton';
import useLocalStorage from 'hooks/useLocalStorage';
import { OrganizationLayout, RegistrationStep } from 'organisms/organization/OrganizationLayout';
import { grey, primaryDark, textSubTitles } from 'utils/colors';
import { LINKS } from 'utils/links';
import { media } from 'utils/media';
import organizationValidationImage from '../../assets/organization/organizationValidation.svg';
import { SResend } from './OrganizationValidation.styled';

export default function OrganizationValidation() {
    const [email] = useLocalStorage('organizationEmail', '');
    const isMobile = useMediaQuery(media.lte('mobile'));

    function onEmailResend() {
        alert('Missing api!');
    }

    if (!email) {
        return <>Error</>;
    }

    if (isMobile) {
        return <>mobile</>;
    }

    return (
        <OrganizationLayout step={RegistrationStep.VERIFY}>
            <Box pt={[3, 4]} pb={[2, 4]} width={1} maxWidth={1200}>
                <Box pl={[3, 2]} pr={[3, 2]} gap={[0, 10, 20]} justifyContent="space-between" display="flex">
                    <Box width={1} textAlign="center" gap={7} display="flex" flexDirection="column" alignItems="center">
                        <Typography variant="h4" color={textSubTitles} fontWeight={300} textAlign="center">
                            Ověření e-mailové adresy
                        </Typography>

                        <Box gap={1} display="flex" flexDirection="column" color={grey}>
                            <Typography>Zaslali jsme vám ověřovací e-mail na adresu</Typography>

                            <Typography>{email}</Typography>

                            <Typography>Pro dokončení registrace klikněte na link v e-mailu.</Typography>
                        </Box>

                        <a href={LINKS.login}>
                            <PrimaryButton text="Zpět na Přihlášení" />
                        </a>

                        <Box display="flex" flexDirection="column" gap={2}>
                            <Typography color={grey} fontSize={12}>
                                Neobdrželi jste žádný e-mail?
                            </Typography>

                            <SResend onClick={onEmailResend} color={primaryDark} fontSize={18} textTransform="uppercase" variant="h6">
                                Zaslat e-mail znovu
                            </SResend>
                        </Box>
                    </Box>

                    <img src={organizationValidationImage} alt="Ověření e-mailové adresy" />
                </Box>
            </Box>
        </OrganizationLayout>
    );
}
