import styled from '@emotion/styled';
import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import PrimaryButton from 'Components/Buttons/PrimaryButton/PrimaryButton';
import { Header } from 'Components/Header/Header';
import { useCallback } from 'react';
import { useHistory } from 'react-router';
import { primaryDark } from 'utils/colors';

const TITLE = 'Chyba 403';
const TEXT = 'Přístup odepřen';
const BUTTON_TEXT = 'Domů';

const Text = styled(Typography)`
    color: ${primaryDark};
    font-size: 48px;
    line-height: 56px;
    margin-bottom: 50px;
`;

const Button = styled(PrimaryButton)`
    margin-bottom: 50px;
`;

export const AccessDenied = () => {
    const history = useHistory();
    const handleClick = useCallback(() => {
        history.push('/');
    }, [history]);
    return (
        <>
            <Header mobileTitle="" />

            <Box display="flex" flexDirection="column" justifyContent="center" flexGrow={1} alignItems="center">
                <Text variant="h1">{TITLE}</Text>
                <Text textAlign="center" variant="h2" maxWidth="500px">
                    {TEXT}
                </Text>
                <Button onClick={handleClick} text={BUTTON_TEXT} />
            </Box>
        </>
    );
};
