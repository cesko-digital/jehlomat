import React, { ChangeEvent, FunctionComponent, useEffect, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { Filter, Range } from './Filter';
import Select from './Select';
import { DatePicker } from './Input';
import { RangeKind } from '../types/RangeKind';

interface FilterPeriodProps {
    onFilter: (kind: RangeKind, from: Dayjs | null, to: Dayjs | null) => void;
    onReset: () => void;
}

const FilterByRange: FunctionComponent<FilterPeriodProps> = ({ onFilter, onReset }) => {
    const [kind, setKind] = useState<RangeKind | ''>('');
    const [from, setFrom] = useState<string>('');
    const [to, setTo] = useState<string>('');

    useEffect(() => {
        if (!kind || !from || !to) return;

        onFilter(kind, dayjs(from), dayjs(to));
    }, [kind, from, to]);

    const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => setKind(e.target.value as RangeKind);
    const handleFrom = (e: ChangeEvent<HTMLInputElement>) => setFrom(e.target.value);
    const handleTo = (e: ChangeEvent<HTMLInputElement>) => setTo(e.target.value);
    const handleReset = () => {
        setFrom('');
        setTo('');
        setKind('');

        onReset();
    };

    return (
        <Filter title="Období" onReset={handleReset}>
            <Select onChange={handleSelect}>
                <option value="">&nbsp;</option>
                <option value="DEMOLISH">Období likvidace</option>
                <option value="FINDING">Období nálezu</option>
            </Select>
            <Range>
                <DatePicker label="Období od" value={from} onChange={handleFrom} />
                <DatePicker label="Období do" value={to} onChange={handleTo} />
            </Range>
        </Filter>
    );
};

export default FilterByRange;
