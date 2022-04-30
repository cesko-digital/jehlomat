import React, { FunctionComponent } from 'react';
import cx from 'classnames';
import { styled } from '@mui/system';
import { ReactComponent as BackIcon } from 'assets/icons/chevron-left.svg';
import RoundButton from './RoundButton';
import { useSetRecoilState } from 'recoil';
import { paginationState } from '../store';
import { PageInfo } from '../types/PageInfo';

const NextIcon = styled(BackIcon)({
    transform: 'rotate(180deg)',
});

const Controls = styled('div')(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    gap: theme.spacing(1),
}));

interface PaginationProps {
    paging?: PageInfo;
}

const Pagination: FunctionComponent<PaginationProps> = ({ paging }) => {
    const setPaging = useSetRecoilState(paginationState);

    const handlePrevious = () => setPaging(state => ({ ...state, index: Math.max(0, state.index - 1) }));
    const handleNext = () => setPaging(state => ({ ...state, index: state.index + 1 }));

    return (
        <Controls>
            <RoundButton className={cx({ disabled: paging && paging.index <= 0 })} filled={true} onClick={handlePrevious}>
                <BackIcon />
            </RoundButton>
            <RoundButton className={cx({ disabled: paging && paging.hasMore === false })} filled={true} onClick={handleNext}>
                <NextIcon />
            </RoundButton>
        </Controls>
    );
};

export default Pagination;
