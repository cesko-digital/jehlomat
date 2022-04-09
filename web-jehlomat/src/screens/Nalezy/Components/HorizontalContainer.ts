import { styled } from '@mui/system';
import { Container } from '@mui/material';

const HorizontalContainer = styled(Container)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    gap: theme.spacing(2),
}));

export default HorizontalContainer;
