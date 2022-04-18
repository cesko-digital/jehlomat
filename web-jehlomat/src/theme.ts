import { createTheme } from '@mui/material';
import { primary, primaryDark, primaryLight } from 'utils/colors';

export const theme = createTheme({
    palette: {
        primary: {
            main: primary,
            dark: primaryDark,
            light: primaryLight,
        },
    },
});
