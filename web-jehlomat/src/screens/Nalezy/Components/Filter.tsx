import React, { FunctionComponent, HTMLAttributes, useState } from 'react';
import { styled } from '@mui/system';
import { ReactComponent as SvgZoomIcon } from 'assets/icons/zoom.svg';
import { ReactComponent as SvgChevronDownIcon } from 'assets/icons/chevron-down.svg';
import { Popper } from '@mui/material';
import { Dropdown } from './Dropdown';

const GRAY = 'rgba(217, 217, 217, 1)';
const GREEN = 'rgba(14, 118, 108, 1)';
const GREEN_LIGHT = 'rgba(14, 118, 108, 0.2)';

export const ZoomIcon = styled(SvgZoomIcon)({
    display: 'inline-block',
    height: 16,
    width: 16,
});

export const ChevronDownIcon = styled(SvgChevronDownIcon)({
    display: 'inline-block',
    height: 16,
    width: 16,
});

export const Input: FunctionComponent<HTMLAttributes<HTMLInputElement>> = ({ children, ...rest }) => (
    <Wrapper>
        <BaseInput {...rest} />
        {children}
    </Wrapper>
);

interface DatePickerProps extends HTMLAttributes<HTMLInputElement> {
    label?: string;
    helper?: string;
}

export const DatePicker: FunctionComponent<DatePickerProps> = ({ label, helper, children, ...rest }) => (
    <Wrapper>
        {label && <Label>{label}</Label>}
        <BaseInput {...rest} type="date" />
        {children}
        {helper && <Helper>{helper}</Helper>}
    </Wrapper>
);

export interface SelectItem {
    text: string;
    value: string | number;
}

interface SelectProps {
    items: Array<SelectItem>;
    value?: SelectItem;
    onSelect?: (item: SelectItem) => void;
}

const Text = styled('div')({
    alignItems: 'center',
    color: 'rgba(120, 120, 120, 1)',
    display: 'flex',
    fontSize: '0.875rem',
    height: '100%',
    width: '100%',

    '&:focus': {
        outline: 'none',
    },
});

const Option = styled('button')({
    background: 'rgba(0, 0, 0, 0.07)',
    border: 'none',
    borderRadius: 16,
    color: 'black',
    display: 'block',
    height: 32,
    margin: '4px 16px',
    padding: '0 16px',

    '&:hover': {
        background: 'rgba(47, 166, 154, 0.32)',
    },

    '&:focus': {
        outline: 'none',
    },
});

export const Select: FunctionComponent<SelectProps> = ({ items, value, onSelect, children, ...rest }) => {
    const [anchorEl, setAnchorEl] = useState<HTMLLabelElement | null>(null);
    const handleClick = (event: React.MouseEvent<HTMLLabelElement>) => setAnchorEl(anchorEl ? null : event.currentTarget);
    const handleSelect = (item: SelectItem) => () => {
        if (typeof onSelect === "function") {
            onSelect(item);
        }
    }
    
    return (
        <>
            <Wrapper onClick={handleClick} active={Boolean(anchorEl)}>
                <Text tabIndex={0}>{value?.text}</Text>
                <ChevronDownIcon />
            </Wrapper>
            <Dropdown open={Boolean(anchorEl)} anchorEl={anchorEl} onClickAway={() => setAnchorEl(null)}>
                {items.map(item => (
                    <Option key={item.value} onClick={handleSelect(item)}>
                        {item.text}
                    </Option>
                ))}
            </Dropdown>
        </>
    );
};

interface WrapperProps {
    active?: boolean;
}

const Wrapper = styled('label', {
    shouldForwardProp: prop => prop !== 'active',
})<WrapperProps>(({ active }) => {
    const highlighted = {
        outline: 'none',
        borderColor: GREEN,
        boxShadow: `0 0 0 2px ${GREEN_LIGHT}`,
    };

    return {
        alignItems: 'center',
        display: 'inline-flex',
        border: `1px solid ${GRAY}`,
        borderRadius: 16,
        boxSizing: 'border-box',
        color: GREEN,
        flexDirection: 'row',
        height: 32,
        lineHeight: 1,
        paddingLeft: 12,
        paddingRight: 12,
        position: 'relative',
        transition: 'all 300ms',
        width: '100%',
        ...(active ? highlighted : {}),

        '&:focus-within': { ...highlighted },
    };
});

const Label = styled('div')({
    background: 'white',
    position: 'absolute',
    bottom: 'calc(100% - 6px)',
    color: 'rgba(137, 138, 141, 1)',
    fontSize: '0.75rem',
    padding: '4px',
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

const Title = styled('h3')({
    color: GREEN,
    fontSize: '1.125rem',
    fontWeight: 400,
    letterSpacing: '1.25px',
    margin: 0,
    padding: 0,
    textTransform: 'uppercase',
});

const Reset = styled('div')({
    fontSize: '0.615rem',
    textAlign: 'right',
    marginBottom: '8px',

    '& > a': {
        color: GREEN,
    },
});

export const Range = styled('div')({
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    position: 'relative',

    '& > *': {
        width: 'calc(50% - 8px)',

        '&:first-child': {
            marginRight: '16px',
        },
    },

    '&:after': {
        background: GRAY,
        content: "''",
        display: 'block',
        height: '1px',
        width: '8px',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translateX(-50%)',
    },
});

interface FilterProps {
    title: string;
}

export const FiltersContainer = styled('div')({
    display: 'flex',
    flexDirection: 'row',
    // justifyContent: 'space-between',

    '& > *': {
        marginRight: 32,

        '&:last-child': {
            marginRight: 0,
        },
    },
});

const FilterContent = styled('div')({
    width: '25%',
});

const FilterControls = styled('div')({
    '& > *:not(:last-child)': {
        marginBottom: 16,
    },
});

export const Filter: FunctionComponent<FilterProps> = ({ title, children }) => (
    <FilterContent>
        <Title>{title}</Title>
        <Reset>
            <a href="#">Zrušit filtr</a>
        </Reset>
        <FilterControls>{children}</FilterControls>
    </FilterContent>
);
