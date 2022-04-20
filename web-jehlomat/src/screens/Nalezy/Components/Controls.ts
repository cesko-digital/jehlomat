import { styled } from '@mui/system';

const Controls = styled('div')({
    display: 'flex',

    '& > *': {
        marginRight: 12,

        '&:last-of-type:not(div)': {
            marginRight: 0,
        },
    },
});

export default Controls;
