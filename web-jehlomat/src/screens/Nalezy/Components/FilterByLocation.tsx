import _ from 'lodash';
import { FunctionComponent, useCallback, useEffect, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { filteringState } from '../store';
import { Filtering, LocationId } from '../types/Filtering';
import AutoComplete from './AutoComplete';
import { Filter } from './Filter';
import loadLocations, { Location, LocationType } from './utils/loadLocations';

const FilterByLocation: FunctionComponent = () => {
    const [locations, setLocations] = useState<Location[]>([]);
    const [selectedLocations, setSelectedLocations] = useState<Location[]>([]);
    const setFilter = useSetRecoilState(filteringState);

    const sortedLocations = _.orderBy(locations, 'name', 'asc');

    const filters = useCallback(
        (locations: Location[]) => {
            setFilter((state: Filtering) => {
                const filter = { ...state };
                delete filter.locationIds;

                const locationIds: LocationId[] = locations.map((location: Location) => ({ id: location.id, type: +LocationType[location.type] }));

                filter.locationIds = locationIds;
                return filter;
            });
        },
        [setFilter],
    );

    useEffect(() => filters(selectedLocations), [filters, selectedLocations]);

    useEffect(() => {
        loadLocations()
            .then(data => setLocations(data))
            .catch(error => console.log(error));
    }, []);

    const handleReset = () => {
        setSelectedLocations([]);
    };

    return (
        <Filter title="Lokalita" onReset={handleReset}>
            <AutoComplete
                options={sortedLocations}
                onChange={(event: any, value: Location[]) => {
                    setSelectedLocations(value);
                }}
                multiple
                value={selectedLocations}
                disableClearable
            />
        </Filter>
    );
};

export default FilterByLocation;
