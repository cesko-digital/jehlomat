import { OrganizationLayout, RegistrationStep } from 'organisms/organization/OrganizationLayout';
import OrganizationRegistrationImage from '../../assets/organization/organizationRegistration.svg';
import { Box, useMediaQuery } from '@mui/material';
import RegistrationForm from './components/RegistrationForm';
import { media } from 'utils/media';
import styled from '@emotion/styled';
import { LINKS } from 'utils/links';

const SImage = styled.img`
    max-width: 40%;
`;

const RegistraceOrganizace = () => {
    const isDesktop = useMediaQuery(media.gt('mobile'));

    return (
        <OrganizationLayout backRoute={LINKS.home} title="Registrovat organizaci" step={RegistrationStep.CREATE}>
            <Box pt={[3, 4]} pb={[2, 4]} width={1} maxWidth={1400}>
                <Box pl={[3, 2]} pr={[3, 2]} gap={[0, 10, 20]} display="flex">
                    <RegistrationForm />

                    {isDesktop && <SImage src={OrganizationRegistrationImage} alt="Registrace organizace" />}
                </Box>
            </Box>
        </OrganizationLayout>
    );
};

export default RegistraceOrganizace;
