import styled from '@emotion/styled';
import { Select, MenuItem, FormHelperText, FormControl } from '@mui/material';
import { FC } from 'react';
import { Label } from '../shared';

type Option = {
    id: number;
    name: string;
};

interface IProps {
    name: string;
    label: string;
    values: Option[];
    onChange: any;
    onBlur: any;
    value: number | null;
    required: boolean;
    error?: string | undefined;
}

const MuiFormControl = styled(FormControl)`
    width: 100%;
    position: relative;
`;

const SelectInput: FC<IProps> = ({ name, label, values, onChange, onBlur, value, error, required }) => {
    return (
        <MuiFormControl error={Boolean(error)}>
            <Label htmlFor={name}>{label}</Label>
            <Select onChange={onChange} onBlur={onBlur} value={value} name={name} required={required} fullWidth>
                {values.map(({ id, name }) => (
                    <MenuItem key={id} value={id}>
                        {name}
                    </MenuItem>
                ))}
            </Select>
            <FormHelperText>{error}</FormHelperText>
        </MuiFormControl>
    );
};

export default SelectInput;
