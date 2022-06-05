import React, { useMemo } from 'react';
import styled from '@emotion/styled';
import dayjs from 'dayjs';
import MaterialPicker, { DateTimePickerProps as MaterialPickerProps } from '@mui/lab/DateTimePicker';
import TextField from '@mui/material/TextField';

interface Props extends Omit<MaterialPickerProps, 'renderInput' | 'rawValue' | 'openPicker' | 'onChange'> {
    onChange: (id: number) => void;
    value: number; // unix
}

export const StyledMaterialPicker = styled.div`
    width: 100%;

    .MuiInputAdornment-root {
        margin-right: 7px !important;
        color: black;
    }
`;

export const DateTimePicker: React.FC<Props> = ({ value, onChange, ...restProps }) => {
    const memoizedValue = useMemo(() => dayjs.unix(value), [value]);

    return (
        <StyledMaterialPicker>
            <MaterialPicker
                renderInput={props => <TextField {...props} fullWidth />}
                value={memoizedValue}
                cancelText="Zrušit"
                clearText="Vymazat"
                todayText="Dnes"
                toolbarTitle="Vyberte datum a čas"
                onChange={newValue => {
                    newValue && onChange((newValue as any).unix());
                }}
                {...restProps}
            />
        </StyledMaterialPicker>
    );
};

export default DateTimePicker;
