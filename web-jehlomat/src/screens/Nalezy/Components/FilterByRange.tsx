import React, { ChangeEvent, FunctionComponent, useCallback, useEffect, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import dayjs from 'dayjs';
import { RangeKind } from 'screens/Nalezy/types/RangeKind';
import { Range as DateRange } from 'screens/Nalezy/types/Range';
import { Filtering } from 'screens/Nalezy/types/Filtering';
import { filteringState } from 'screens/Nalezy/store';
import { Filter, Range } from './Filter';
import { DatePicker } from './Input';
import Select from './Select';

const FilterByRange: FunctionComponent = () => {
    const [kind, setKind] = useState<RangeKind | ''>('');
    const [from, setFrom] = useState<string>('');
    const [to, setTo] = useState<string>('');
    const setFilter = useSetRecoilState(filteringState);

    const filtering = useCallback((kind: RangeKind, range: DateRange) => {
        setFilter((state: Filtering) => {
            const filter = { ...state };
            delete filter.createdAt;
            delete filter.demolishedAt;

            if (kind === 'DEMOLISH') return { ...filter, demolishedAt: range };
            if (kind === 'FIND') return { ...filter, createdAt: range };

            return filter;
        });
    }, []);
    const reset = useCallback(() => {
        setFilter(state => {
            const filter = { ...state };
            delete filter.createdAt;
            delete filter.demolishedAt;

            return filter;
        });
    }, []);

    useEffect(() => {
        const leave = !kind || !from || !to;
        if (leave) return;

        filtering(kind, { from: +dayjs(from), to: +dayjs(to) });
    }, [kind, from, to]);

    const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => setKind(e.target.value as RangeKind);
    const handleFrom = (e: ChangeEvent<HTMLInputElement>) => setFrom(e.target.value);
    const handleTo = (e: ChangeEvent<HTMLInputElement>) => setTo(e.target.value);
    const handleReset = () => {
        setFrom('');
        setTo('');
        setKind('');

        reset();
    };

    return (
        <Filter title="Období" onReset={handleReset}>
            <Select onChange={handleSelect}>
                <option value="">&nbsp;</option>
                <option value="DEMOLISH">Období likvidace</option>
                <option value="FIND">Období nálezu</option>
            </Select>
            <Range>
                <DatePicker label="Období od" value={from} onChange={handleFrom} />
                <DatePicker label="Období do" value={to} onChange={handleTo} />
            </Range>
        </Filter>
    );
};

export default FilterByRange;
