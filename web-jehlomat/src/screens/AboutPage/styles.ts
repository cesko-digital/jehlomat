import styled from '@emotion/styled';
import { Box, Container as MUIContainer, Typography } from '@mui/material';
import { darkGrey, primaryDark, secondary } from 'utils/colors';

export const Container = styled(MUIContainer)`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

export const Title = styled(Typography)<{ isMobile: boolean }>`
    color: ${primaryDark};
    font-size: ${p => (p.isMobile ? '24px' : '48px')};
    line-height: ${p => (p.isMobile ? '28px' : '56px')};
    font-weight: 300px;
    margin-top: ${p => (p.isMobile ? '30px' : '130px')};
    margin-bottom: ${p => (p.isMobile ? '15px' : '0')};
    width: ${p => (p.isMobile ? '100%' : 'auto')};
`;

export const StatisticsBox = styled(Box)<{ isMobile: boolean }>`
    margin-top: ${p => (p.isMobile ? '30px' : '57px')};
    display: flex;
    align-items: ${p => (p.isMobile ? 'start' : 'center')};
    justify-content: space-between;
    width: ${p => (p.isMobile ? '277px' : '430px')};
`;

export const StaticticsItem = styled(Box)<{ isMobile: boolean }>`
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: ${p => (p.isMobile ? '100px' : 'auto')};
`;

export const IconBox = styled(Box)`
    width: 56px;
    height: 56px;
    border-radius: 50%;
    border: 3px solid ${secondary};
    display: flex;
    align-items: center;
    justify-content: center;
`;

export const StatisticsInfo = styled(Box)`
    text-align: center;
    color: ${darkGrey};
    font-size: 12px;
    line-height: 16px;
    text-transform: uppercase;
    margin-top: 13px;
`;

export const SubTitle = styled(Box)`
    text-align: center;
    font-weight: 700;
    margin-top: 40px;
`;

const BodyTextBox = styled(Box)`
    color: ${darkGrey};
    text-align: center;
    margin-bottom: 40px;

    a {
        color: ${primaryDark};
        font-weight: 700;
    }
`;

export const GeneralInformationBox = styled(BodyTextBox)`
    margin-top: 60px;
    max-width: 800px;
`;

export const AnonymousTextBox = styled(BodyTextBox)`
    margin-top: 10px;
    max-width: 600px;
`;

export const JehlomatForOrganizationTextBox = styled(BodyTextBox)`
    margin-top: 10px;
    max-width: 800px;
`;

export const Footer = styled(Box)<{ isMobile: boolean }>`
    display: flex;
    align-items: center;
    justify-content: ${p => (p.isMobile ? 'space-between' : 'center')};
    width: ${p => (p.isMobile ? '100%' : 'auto')};
    margin: ${p => (p.isMobile ? '24px 0 36px' : '40px 0 46px')};
`;
