import styled from '@emotion/styled';
import { Typography } from '@mui/material';

export const PageHeading = styled(Typography)`
    font-size: 24px;
    line-height: 24px;
    font-weight: 300;
    margin: 80px 0 86px 97px;

    &.mobile {
    }
`;

export const FormWrapper = styled.div`
    width: 100%;
    box-sizing: border-box;
    padding-left: 114px;
    padding-right: 154px;

    &.mobile {
        padding: 0;
        margin-top: 21px;
    }

    label {
        color: rgba(0, 0, 0, 0.6);
    }

    .MuiInputBase-root {
        margin-top: 12px;
        margin-bottom: 24px;
    }

    p.Mui-error {
        margin-top: -12px;
        margin-bottom: 24px;
    }
`;

export const ButtonWrapper = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 40px;

    button {
        height: 48px;
        width: 203px;
    }
`;
