import React, { useMemo, useState } from 'react';
import styled from '@emotion/styled';
import dayjs, { Dayjs } from 'dayjs';
import MaterialPicker, { DateTimePickerProps as MaterialPickerProps } from '@mui/lab/DateTimePicker';
import TextField from '@mui/material/TextField';

interface Props extends Omit<MaterialPickerProps, 'renderInput' | 'rawValue' | 'openPicker' | 'onChange'> {
    onChange: (id: number | string) => void;
    value: number; // unix
    required?: boolean;
    error?: string | undefined;
}

export const StyledMaterialPicker = styled.div`
    width: 100%;

    .MuiInputAdornment-root {
        margin-right: 7px !important;
        color: black;
    }
`;

export const DateTimePicker: React.FC<Props> = ({ value, onChange,  ...restProps }) => {
    const memoizedValue = useMemo(() => dayjs.unix(value), [value]);


    return (
        <StyledMaterialPicker>
            <MaterialPicker
                renderInput={props => (
                    <TextField {...props} error={Boolean(restProps.error)} helperText={restProps.error} fullWidth required={restProps.required} onChange={(event) => onChange(event.target.value)} />
                )}
                value={memoizedValue}
                cancelText="Zrušit"
                clearText="Vymazat"
                todayText="Dnes"
                toolbarTitle="Vyberte datum a čas"
                onChange={(newValue, keyboardInputValue) => {
                    if (keyboardInputValue) {
                        onChange(keyboardInputValue)
                        return
                    }
                    newValue && onChange((newValue as any));
                }}
                {...restProps}
            />
        </StyledMaterialPicker>
    );
};

export default DateTimePicker;
