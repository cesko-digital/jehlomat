import React from 'react';
import styled from '@emotion/styled';
import { primary, textSubTitles, white } from '../../utils/colors';
import { media } from '../../utils/media';
import { Typography, useMediaQuery } from '@mui/material';
import logo from '../../assets/logo/logo-jehlomat.svg';
import CheckIcon from '../../assets/icons/check.svg';
import { SCheckIcon, SLogo } from './Dekujeme.styled';
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
`;

export default function Dekujeme() {
    const isMobile = useMediaQuery(media.lte('mobile'));

    function renderContent() {
        if (isMobile) {
            return (
                <Container>
                    <Typography maxWidth={190} mb={[10, 10]} variant="h5" textAlign="center" fontWeight="300">
                        Vaše organizace byla úspěšně zaregistrovaná!
                    </Typography>

                    <SLogo src={logo} alt="Jehlomat" />

                    <SCheckIcon>
                        <img src={CheckIcon} alt="Jehlomat" />
                    </SCheckIcon>
                </Container>
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
