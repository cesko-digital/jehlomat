import { styled } from '@mui/system';
import { darkGrey, primaryDark, textGold } from 'utils/colors';

export const TextMuted = styled('span')({
    color: darkGrey,
});

export const TextGold = styled('span')({
    color: textGold,
});

export const TextHighlight = styled('span')({
    color: primaryDark,
});

export const TextDanger = styled('span')({
    color: 'rgba(220, 53, 69, 1)',
});

export const Bold = styled('span')({
    fontWeight: 700,
});
