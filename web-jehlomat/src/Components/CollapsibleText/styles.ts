import styled from '@emotion/styled';
import { Box, Typography } from '@mui/material';
import { darkGrey, primaryDark, black } from 'utils/colors';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

export const Wrapper = styled(Box)`
    width: 100%;
    padding: 30px 0;
    border-top: 1px solid ${primaryDark};

    &:last-child {
        border-bottom: 1px solid ${primaryDark};
    }
`;

export const TitleBox = styled(Box)`
    display: flex;
    align-items: center;
`;

export const Title = styled(Typography)`
    color: ${black};
    font-size: 18px;
    line-height: 21px;
    font-weight: 700;
    cursor: pointer;
`;

export const Icon = styled(ArrowDropDownIcon)<{ open: boolean }>`
    margin: 0 20px 0 10px;
    color: ${primaryDark};
    cursor: pointer;
    transform: ${p => (p.open ? 'none' : 'rotate(-90deg)')};
`;

export const Text = styled(Typography)`
    color: ${darkGrey};
    font-size: 18px;
    line-height: 21px;
`;

export const TextBox = styled(Box)<{ isMobile: boolean }>`
    margin-top: 30px;
    max-width: ${p => (p.isMobile ? '100%' : '800px')};
    margin-left: ${p => (p.isMobile ? '0' : '65px')};

    a {
        color: ${primaryDark};
        font-weight: 700;
    }
`;
