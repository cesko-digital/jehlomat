import React, { FunctionComponent } from 'react';
import { styled } from '@mui/system';
import ControlWrapper from 'screens/Nalezy/Components/ControlWrapper';

const GREEN = 'rgba(14, 118, 108, 1)';

const BaseSelect = styled('select')({
    border: 'none',
    flexGrow: 1,
    lineHeight: 1,
    padding: 0,
    margin: 0,
    width: '100%',
    color: GREEN,

    '&:focus': {
        outline: 'none',
    },
});

const Select: FunctionComponent<React.ComponentPropsWithoutRef<'select'>> = ({ children, ...rest }) => (
    <ControlWrapper>
        <BaseSelect {...rest}>{children}</BaseSelect>
    </ControlWrapper>
);

export default Select;
