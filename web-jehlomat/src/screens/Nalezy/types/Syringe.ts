import {IUser as Person} from "../../../types";
import {Location} from "./Location";

export interface Syringe {
    id: string;
    createdAt: number;
    createdBy: Person;
    reservedTill?: number;
    reservedBy?: Person;
    demolishedAt?: number;
    demolishedBy?: Person;
    photo?: string;
    count: number;
    note: string;
    demolisher: string;
    gps_coordinates: string;
    demolished: boolean;
    location: Location;
}
