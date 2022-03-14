import React, {useMemo} from 'react';
import dayjs from 'dayjs';
import MaterialPicker, { DateTimePickerProps as MaterialPickerProps } from '@mui/lab/DateTimePicker';
import TextField from '@mui/material/TextField';

interface Props extends Omit<MaterialPickerProps, 'renderInput' | 'rawValue' | 'openPicker' | 'onChange'> {
    onChange: (id: number) => void;
    value: number; // unix
}

export const DateTimePicker: React.FC<Props> = ({ value, onChange, ...restProps }) => {
    const memoizedValue = useMemo(() => dayjs.unix(value), [value]);

    return (
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
    );
};

export default DateTimePicker;
