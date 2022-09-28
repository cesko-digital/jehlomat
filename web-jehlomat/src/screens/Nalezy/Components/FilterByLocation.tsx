import { Chip, Paper } from '@mui/material';
import _ from 'lodash';
import { FunctionComponent, useCallback, useEffect, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { filteringState } from '../store';
import { Filtering, LocationId } from '../types/Filtering';
import { Filter } from './Filter';
import Select from './Select';
import loadLocations, { Location, LocationType } from './utils/loadLocations';

const FilterByLocation: FunctionComponent = () => {
    const [location, setLocation] = useState<string>();
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

    const handleDelete = (location: Location) => {
        setSelectedLocations(selectedLocations.filter(loc => loc !== location));
    };

    const handleReset = () => {
        setLocation('');
        setSelectedLocations([]);
    };

    const addToSelectedLocations = (locationId: string) => {
        const selectedLocation = locations.find(location => location.id === locationId);
        if (selectedLocation) {
            if (!selectedLocations.includes(selectedLocation)) {
                setSelectedLocations([...selectedLocations, selectedLocation]);
            }
        }
    };

    return (
        <Filter title="Lokalita" onReset={handleReset}>
            <Select
                onChange={event => {
                    addToSelectedLocations(event.target.value);
                    setLocation(event.target.value);
                }}
                value={location}
            >
                <option value="">&nbsp;</option>
                {sortedLocations.map((location: Location) => {
                    return (
                        <option key={location.id} value={location.id}>
                            {location.name}
                        </option>
                    );
                })}
            </Select>
            <Paper
                elevation={0}
                sx={{
                    background: 'inherit',
                    display: 'flex',
                    gap: 1,
                    flexWrap: 'wrap',
                    listStyle: 'none',
                    p: 0.5,
                    m: 0,
                }}
            >
                {selectedLocations.map(location => {
                    return (
                        <Chip
                            key={location.id}
                            label={location.name}
                            sx={{
                                backgroundColor: 'rgba(47, 166, 154, 0.31)',
                                color: '#0E766C',
                                '& .MuiChip-deleteIcon': {
                                    color: '#0E766C',
                                },
                            }}
                            onDelete={() => handleDelete(location)}
                        />
                    );
                })}
            </Paper>
        </Filter>
    );
};

export default FilterByLocation;
