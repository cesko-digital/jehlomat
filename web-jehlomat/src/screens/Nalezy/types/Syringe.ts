import { IUser as Person } from '../../../types';
import { Location } from './Location';

export interface Syringe {
    id: string;
    createdAt: number;
    createdBy?: Person;
    reservedTill?: number;
    reservedBy?: Person;
    demolishedAt?: number;
    demolishedBy?: Person;
    photo?: string;
    count: number;
    note: string;
    demolisherType?: string;
    gps_coordinates: string;
    demolished: boolean;
    location: Location;
}

export type SyringeChangeReq = Omit<Syringe, 'createdBy' | 'location' | 'reservedBy' | 'demolishedBy'> & {
    createdById: number | undefined;
    reservedById: number | undefined;
    demolishedId: number | undefined;
    locationId: number | undefined;
};
