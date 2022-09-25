import styled from '@emotion/styled';
import { Typography } from '@mui/material';

export const PageHeading = styled(Typography)`
    font-size: 24px;
    line-height: 24px;
    font-weight: 300;
    margin: 80px 0 86px 121px;
`;

export const SectionWrapper = styled.div`
    width: 100%;
    box-sizing: border-box;
    padding-left: 114px;
    padding-right: 154px;

    svg {
        margin-top: 14px;
    }

    .MuiInputBase-root {
        margin-top: 12px;
        margin-bottom: 24px;
    }

    p.Mui-error {
        margin-top: -12px;
        margin-bottom: 24px;
    }

    &.mobile {
        padding: 0;
        margin-top: 21px;

        label {
            font-size: 18px;
            font-weight: 700;
            padding-bottom: 0;
        }

        .MuiInputBase-root,
        svg {
            margin-top: 12px;
            margin-bottom: 12px;
        }
    }
`;

export const ButtonWrapper = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 40px;

    button {
        min-width: 203px;
    }

    &.mobile {
        margin-top: 0px;

        button {
            min-width: 139px;
        }
    }
`;
