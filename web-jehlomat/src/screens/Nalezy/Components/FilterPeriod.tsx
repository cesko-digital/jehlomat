import React, {ChangeEvent, FunctionComponent, SyntheticEvent, useEffect, useRef, useState} from 'react';
import {DatePicker, Filter, Select, SelectItem, Range} from './Filter';
import dayjs, {Dayjs} from 'dayjs';

interface FilterPeriodProps {
  onFilter: (kind: string, from: Dayjs | null, to: Dayjs | null) => void;
}

export const KIND = {
  DEMOLISH: 'DEMOLISH',
  FINDING: 'FINDING',
  RESET: 'RESET',
};

const FilterPeriod: FunctionComponent<FilterPeriodProps> = ({onFilter}) => {
  const [period, setPeriod] = useState<SelectItem | undefined>();
  const [from, setFrom] = useState<string>('');
  const [to, setTo] = useState<string>('');

  useEffect(() => {
    if (!period || !from || !to) return;

    onFilter(period.value.toString(), dayjs(from), dayjs(to));
  }, [period, from, to]);

  const handleSelect = (item: SelectItem) => setPeriod(item);
  const handleFrom = (e: ChangeEvent<HTMLInputElement>) => setFrom(e.target.value);
  const handleTo = (e: ChangeEvent<HTMLInputElement>) => setTo(e.target.value);
  const handleReset = () => {
    setPeriod(undefined);
    setFrom('');
    setTo('');
    
    onFilter(KIND.RESET, null, null);
  };

  return (
    <Filter title="Období" onReset={handleReset}>
      <Select
        value={period}
        onSelect={handleSelect}
        items={[
          {text: 'Období likvidace', value: KIND.DEMOLISH},
          {text: 'Období nálezu', value: KIND.FINDING},
        ]}
      />
      <Range>
        <DatePicker 
          label="Období od" 
          disabled={!Boolean(period)} 
          value={from}
          onChange={handleFrom}
        />
        <DatePicker 
          label="Období do" 
          disabled={!Boolean(period)}
          value={to}
          onChange={handleTo}
        />
      </Range>
    </Filter>
  );
};

export default FilterPeriod;
