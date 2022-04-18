import React, { FunctionComponent, useEffect, useState } from 'react';
import { SyringeState } from '../types/SyringeState';
import { Filter } from './Filter';
import Select from './Select';

interface FilterStateProps {
    onFilter: (state: SyringeState) => void;
    onReset: () => void;
}

const FilterByState: FunctionComponent<FilterStateProps> = ({ onFilter, onReset }) => {
    const [state, setState] = useState<SyringeState | ''>('');

    useEffect(() => {
        if (!state) return;

        onFilter(state);
    }, [state]);

    const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => setState(e.target.value as SyringeState);
    const handleReset = () => {
        setState('');
        onReset();
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
