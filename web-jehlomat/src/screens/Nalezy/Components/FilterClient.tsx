import React, {FunctionComponent, useState} from "react";
import {Filter, Input, Select, SelectItem, ZoomIcon} from "./Filter";

const FilterClient: FunctionComponent = () => {
  const [organization, setOrganization] = useState<SelectItem | undefined>();

  return (
    <Filter title="Zadavatel nálezu">
      <Input>
        <ZoomIcon />
      </Input>
      <Select
        value={organization}
        onSelect={item => setOrganization(item)}
        items={[
          { text: 'Organizace', value: 1 },
          { text: 'Tým', value: 2 },
          { text: 'Jednotlivec', value: 3 },
        ]}
      />
    </Filter>
  );
};

export default FilterClient;