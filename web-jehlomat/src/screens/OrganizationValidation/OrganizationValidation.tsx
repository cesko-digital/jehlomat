import { Box, Typography, useMediaQuery } from '@mui/material';
import PrimaryButton from 'Components/Buttons/PrimaryButton/PrimaryButton';
import useLocalStorage from 'hooks/useLocalStorage';
import { OrganizationLayout, RegistrationStep } from 'organisms/organization/OrganizationLayout';
import { grey, primary, primaryDark, textSubTitles, white } from 'utils/colors';
import { media } from 'utils/media';
import organizationValidationImage from '../../assets/organization/organizationValidation.svg';
import messageIcon from '../../assets/icons/message.svg';
import { SResend, SMessageIcon, SResendDelimiter } from './OrganizationValidation.styled';
import SecondaryButton from 'Components/Buttons/SecondaryButton/SecondaryButton';
import { LINKS } from 'routes';

export default function OrganizationValidation() {
    const [email] = useLocalStorage('organizationEmail', '');
    const isMobile = useMediaQuery(media.lte('mobile'));

    function onEmailResend() {
        alert('Missing api!');
    }

    function renderContent() {
        if (!email) {
            return <Typography>Chybějící email, zkuste prosím projít registraci znovu</Typography>;
        }

        if (isMobile) {
            return (
                <Box
                    bgcolor={primary}
                    color={white}
                    position="fixed"
                    top={0}
                    left={0}
                    height={1}
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    textAlign="center"
                    zIndex={200}
                    pl={1}
                    pr={1}
                    sx={{
                        width: 'calc(100% - 16px)',
                    }}
                >
                    <Typography variant="h5" mt={5} mb="auto">
                        Ověření e-mailové adresy
                    </Typography>

                    <SMessageIcon src={messageIcon} alt="Validace" />

                    <Typography mb={0}>Zaslali jsme vám ověřovací e-mail na adresu {email}.</Typography>
                    <Typography>Pro dokončení registrace klikněte na link v e-mailu.</Typography>

                    <Box mt={5} mb="auto">
                        <a href={LINKS.LOGIN}>
                            <SecondaryButton text="ZPĚT na Přihlášení" />
                        </a>
                    </Box>

                    <SResendDelimiter mb={1}>Pokud jste neobdrželi potvrzující e-mail</SResendDelimiter>
                    <SResend onClick={onEmailResend} fontWeight="bold" mb={4}>
                        Zaslat e-mail znova
                    </SResend>
                </Box>
            );
        }

        return (
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

                    <a href={LINKS.LOGIN}>
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
        );
    }

    return (
        <OrganizationLayout step={RegistrationStep.VERIFY}>
            <Box pt={[3, 4]} pb={[2, 4]} width={1} maxWidth={1200}>
                {renderContent()}
            </Box>
        </OrganizationLayout>
    );
}
