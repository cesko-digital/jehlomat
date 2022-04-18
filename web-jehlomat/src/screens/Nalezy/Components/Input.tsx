import React, { FunctionComponent } from 'react';
import ControlWrapper from './ControlWrapper';
import { styled } from '@mui/system';

interface DatePickerProps extends React.ComponentPropsWithoutRef<'input'> {
    label?: string;
    helper?: string;
}

const Label = styled('div')({
    background: 'transparent',
    position: 'absolute',
    bottom: 'calc(100% - 2px)',
    color: 'black',
    fontSize: '0.75rem',
    letterSpacing: 0.5,
    padding: 0,
});

const Helper = styled('div')({
    background: 'white',
    position: 'absolute',
    top: 'calc(100% - 6px)',
    color: 'rgba(137, 138, 141, 1)',
    fontSize: '0.75rem',
    padding: '4px',
});

const BaseInput = styled('input')({
    border: 'none',
    color: '#000',
    flexGrow: 1,
    lineHeight: 1,
    padding: 0,
    margin: 0,
    width: '100%',

    '&[type="date"]::-webkit-calendar-picker-indicator': {
        display: 'none',
    },

    '&:focus': {
        outline: 'none',
    },
});

export const Input: FunctionComponent<React.ComponentPropsWithoutRef<'input'>> = ({ children, ...rest }) => (
    <ControlWrapper>
        <BaseInput {...rest} />
        {children}
    </ControlWrapper>
);

export const DatePicker: FunctionComponent<DatePickerProps> = ({ label, helper, children, ...rest }) => (
    <ControlWrapper>
        {label && <Label>{label}</Label>}
        <BaseInput {...rest} type="date" />
        {children}
        {helper && <Helper>{helper}</Helper>}
    </ControlWrapper>
);
