import { styled } from '@mui/system';
import { Checkbox as MuiCheckbox } from '@mui/material';

const Checkbox = styled(MuiCheckbox)({
    '&.Mui-checked': {
        color: 'rgba(14, 118, 108, 1)',
    },
});

export default Checkbox;
