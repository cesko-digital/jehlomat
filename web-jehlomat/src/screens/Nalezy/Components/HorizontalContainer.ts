import { styled } from '@mui/system';
import { Container } from '@mui/material';

const HorizontalContainer = styled(Container)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',

    '& > *': {
        marginRight: theme.spacing(2),

        '&:last-child': {
            marginRight: 0,
        },
    },
}));

export default HorizontalContainer;
