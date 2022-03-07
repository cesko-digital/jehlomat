import React from 'react';
import styled from '@emotion/styled';
import { primary, textSubTitles, white } from '../../utils/colors';
import { media } from '../../utils/media';
import { Typography, useMediaQuery } from '@mui/material';
import { OrganizationLayout, RegistrationStep } from '../../organisms/organization/OrganizationLayout';
import { Box } from '@mui/system';

const Container = styled.div`
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: ${white};
    background-color: ${primary};
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
`;

function OrganizationConfirmedVerified() {
    const isMobile = useMediaQuery(media.lte('mobile'));

    function renderContent() {
        if (isMobile) {
            return (
                <Container>
                    <Typography maxWidth={190} mb={[10, 10]} variant="h5" textAlign="center" fontWeight="300">
                        Může nám to chvíli trvat. Pro vaši bezpečnost schvalujeme každou organizaci ručně.
                    </Typography>

                    <Typography variant="h5" fontWeight="300">
                        Děkujeme za trpělivost!
                    </Typography>
                </Container>
            );
        }

        return (
            <Box display="flex" justifyContent="center" alignContent="center" flexDirection="column" gap={6} textAlign="center">
                <Typography maxWidth={500} variant="h5" color={textSubTitles} fontWeight="300">
                    Může nám to chvíli trvat. Pro vaši bezpečnost schvalujeme každou organizaci ručně.
                </Typography>

                <Typography variant="h5" color={textSubTitles} fontWeight="300">
                    Děkujeme za trpělivost!
                </Typography>
            </Box>
        );
    }

    return <OrganizationLayout step={RegistrationStep.SUCCESS}>{renderContent()}</OrganizationLayout>;
}

export default OrganizationConfirmedVerified;
