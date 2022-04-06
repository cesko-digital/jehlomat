import React, {FunctionComponent} from 'react';
import { styled } from '@mui/system';

const GRAY = 'rgba(217, 217, 217, 1)';
const GREEN = 'rgba(14, 118, 108, 1)';

interface FilterProps {
    title: string;
    onReset?: () => void;
}

const Title = styled('h3')({
    color: GREEN,
    fontSize: '0.875rem',
    fontWeight: 500,
    letterSpacing: 0.25,
    margin: 0,
    padding: 0,
    textTransform: 'uppercase',
});

const Reset = styled('div')({
    textAlign: 'right',
    marginBottom: '8px',

    '& > button': {
        background: 'transparent',
        border: 'none',
        borderRadius: '50%',
        color: GREEN,
        cursor: 'pointer',
        fontSize: '0.75rem',

        '&:focus': {
            outline: 'none',
        },
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

const FilterContent = styled('div')({
    width: '100%',
});

const FilterControls = styled('div')({
    '& > *:not(:last-child)': {
        marginBottom: 16,
    },
});

export const Filter: FunctionComponent<FilterProps> = ({ title, onReset, children }) => {
    const handleReset = () => {
        if (typeof onReset === 'function') {
            onReset();
        }
    };

    return (
        <FilterContent>
            <Title>{title}</Title>
            <Reset>
                <button onClick={handleReset}>Zrušit filtr</button>
            </Reset>
            <FilterControls>{children}</FilterControls>
        </FilterContent>
    );
};
