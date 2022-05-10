import React, { FunctionComponent, useCallback, useEffect, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { SyringeState } from '../types/SyringeState';
import { Filter } from './Filter';
import Select from './Select';
import { filteringState } from 'screens/Nalezy/store';
import { Filtering } from 'screens/Nalezy/types/Filtering';

const FilterByState: FunctionComponent = () => {
    const [state, setState] = useState<SyringeState | ''>('');
    const setFilter = useSetRecoilState(filteringState);

    const filter = useCallback(
        (status: SyringeState) => {
            setFilter((state: Filtering) => ({ ...state, status }));
        },
        [setFilter],
    );

    const reset = useCallback(() => {
        setFilter(state => {
            const filter = { ...state };
            delete filter.status;

            return filter;
        });
    }, [setFilter]);

    useEffect(() => {
        if (!state) return;

        filter(state);
    }, [state, filter]);

    const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => setState(e.target.value as SyringeState);
    const handleReset = () => {
        setState('');

        reset();
    };

    return (
        <Filter title="Stav" onReset={handleReset}>
            <Select onChange={handleSelect} value={state}>
                <option value="">&nbsp;</option>
                <option value="DEMOLISHED">Zlikvidováno</option>
                <option value="WAITING">Čeká na likvidaci</option>
                <option value="RESERVED">Rezervováno TP</option>
            </Select>
        </Filter>
    );
};

export default FilterByState;
