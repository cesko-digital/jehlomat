import React, { FunctionComponent, useEffect, useState } from 'react';
import { ActiveFilter } from 'screens/Nalezy/types';
import { FiltersContainer } from './Filter';
import FilterPeriod, { KIND } from './FilterPeriod';
import FilterState from './FilterState';
import { Dayjs } from 'dayjs';

interface FiltersProps {
    onFilter: (filter: ActiveFilter) => void;
}

const Filters: FunctionComponent<FiltersProps> = ({ onFilter }) => {
    const [filter, setFilter] = useState<ActiveFilter>({});
    
    useEffect(() => {
        onFilter(filter);
    }, [filter]);
    
    const handlePeriodFilter = (kind: string, from: Dayjs | null, to: Dayjs | null) => {
        if (kind === KIND.RESET) {
            setFilter(filter => ({ ...filter, createdAt: undefined, demolishedAt: undefined }));
        }
        
        if (!from || !to) return;
        if (kind === KIND.DEMOLISH) {
            setFilter(filter => ({
                ...filter, 
                createdAt: undefined,
                demolishedAt: { from: +from, to: +to },
            }));
        }
        
        if (kind === KIND.FINDING) {
            setFilter(filter => ({
                ...filter, 
                demolishedAt: undefined,
                createdAt: {from: +from, to: +to},
            }));
        }
    };
    const handleStateFilter = (state: string | undefined) => {
        if (!state) setFilter(filter => ({ ...filter, status: undefined }));
        
        setFilter(filter => ({ ...filter, status: state }));
    };
    
    return (
        <FiltersContainer>
            <FilterPeriod onFilter={handlePeriodFilter} />
            <FilterState onFilter={handleStateFilter} />
        </FiltersContainer>
    );
};

export default Filters;
