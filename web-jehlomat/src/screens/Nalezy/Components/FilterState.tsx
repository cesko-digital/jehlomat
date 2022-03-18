import React, {FunctionComponent, useEffect, useState} from "react";
import {Filter, Select, SelectItem} from "./Filter";

interface FilterStateProps {
  onFilter: (state: string | undefined) => void;
}

const FilterState: FunctionComponent<FilterStateProps> = ({ onFilter }) => {
  const [state, setState] = useState<SelectItem | undefined>();
  
  useEffect(() => {
    onFilter(state?.value?.toString())
  }, [state]);
  
  const handleReset = () => setState(undefined);
  
  return (
    <Filter title="Stav" onReset={handleReset}>
      <Select
        value={state}
        onSelect={item => setState(item)}
        items={[
          { text: 'Zlikvidováno', value: 'DEMOLISHED' },
          { text: 'Čeká na likvidaci', value: 'WAITING' },
          { text: 'Rezervováno TP', value: 'RESERVED' },
        ]}
      />
    </Filter>
  );
};

export default FilterState;