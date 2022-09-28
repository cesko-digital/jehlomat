import { AxiosResponse } from 'axios';
import { API } from 'config/baseURL';
export enum LocationType {
    OKRES,
    OBEC,
    MC
}

export type Location = {
    id: string,
    name: string,
    type: LocationType
}


const loadLocations = async () => {
    const url = `/location/all`;
    const locations: AxiosResponse<Array<Location>> = await API.get(url);
    if (locations.status !== 200) throw new Error('Unable to load data');

    return locations.data;
};

export default loadLocations;
