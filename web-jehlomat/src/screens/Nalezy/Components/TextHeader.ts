import { styled } from '@mui/system';
import { primaryDark } from 'utils/colors';

const TextHeader = styled('h1')({
    color: primaryDark,
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: 20,
    lineHeight: 1,
    letterSpacing: 1.25,
    textTransform: 'uppercase',
});

export default TextHeader;
