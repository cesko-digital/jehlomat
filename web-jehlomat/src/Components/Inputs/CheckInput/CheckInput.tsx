import React from 'react';
import FormControlLabel, { FormControlLabelProps } from '@mui/material/FormControlLabel';
import Checkbox, { CheckboxProps } from '@mui/material/Checkbox';

interface Props extends FormControlLabelProps {
    checkboxProps: CheckboxProps;
}

export const CheckInput: React.FC<Props> = ({ checkboxProps, ...labelProps }) => {
    return <FormControlLabel {...labelProps} control={<Checkbox {...checkboxProps} />} />;
};

export default CheckInput;
