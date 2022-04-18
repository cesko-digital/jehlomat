import { styled } from '@mui/system';
import { LinearProgress } from '@mui/material';

const Loading = styled(LinearProgress)({
    backgroundColor: 'rgba(14, 118, 108, 0.2)',
    borderRadius: 4,

    '& .MuiLinearProgress-bar': {
        backgroundColor: 'rgba(14, 118, 108, 1)',
    },
});

export default Loading;
