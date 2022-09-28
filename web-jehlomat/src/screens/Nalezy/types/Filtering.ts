import { LocationType } from '../Components/utils/loadLocations';
import { Range } from './Range';
import { ReporterType } from './ReporterType';

export type LocationId = {
    id: string;
    type: LocationType;
}
export interface Filtering {
    locationIds?: LocationId[];
    createdAt?: Range;
    createdBy?: {
        id: number;
        type: ReporterType;
    };
    demolishedAt?: Range;
    status?: string;
}
