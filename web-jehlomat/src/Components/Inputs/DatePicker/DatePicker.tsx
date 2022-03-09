import React, {useMemo} from 'react';
import dayjs from 'dayjs';
import DateTimePicker, { DateTimePickerProps } from '@mui/lab/DateTimePicker';
import TextField from '@mui/material/TextField';

interface Props extends Omit<DateTimePickerProps, 'renderInput' | 'rawValue' | 'openPicker' | 'onChange'> {
    onChange: (id: number) => void;
    value: number; // unix
}

export const DatePicker: React.FC<Props> = ({ value, onChange, ...restProps }) => {
    const memoizedValue  = useMemo(() => dayjs.unix(value), [value]);

    return (
        <DateTimePicker
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

export default DatePicker;
