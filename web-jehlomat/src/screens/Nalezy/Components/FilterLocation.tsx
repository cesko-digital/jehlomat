import React, {FunctionComponent, useState} from "react";
import {Filter, Input, ZoomIcon} from "./Filter";

const FilterLocation: FunctionComponent = () => {
  const [localities, setLocalities] = useState<Array<string>>([]);
  
  const handleLocationKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const input = e.target as HTMLInputElement;
    if (e.key !== 'Enter' || !input.value) return;

    setLocalities(state => [...state, input.value]);
  };

  return (
    <Filter title="Lokalita">
      <Input onKeyUp={handleLocationKeyUp}>
        <ZoomIcon />
      </Input>
    </Filter>
  );
};

export default FilterLocation;