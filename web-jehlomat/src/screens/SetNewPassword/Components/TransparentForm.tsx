import { styled } from '@mui/material';
import { Form } from 'formik';
import { size } from 'utils/spacing';

export const TransparentForm = styled(Form)({
    boxSizing: 'border-box',
    width: '100%',
    maxWidth: size(152), // 608px
    padding: size(7),
    paddingTop: size(15),
});
