import { Syringe } from 'screens/Nalezy/types/Syringe';
import { isObject, has } from 'lodash';

export enum LocationState {
    CHECKING = 'CHECKING',
    CHECKED = 'CHECKED',
    GRANTED = 'GRANTED',
}

export interface Address {
    place_id: number;
    licence: string;
    osm_type: string;
    osm_id: number;
    boundingbox: [string, string, string, string];
    lat: string;
    lon: string;
    display_name: string;
    class: string;
    type: string;
    importance: number;
    address: {
        road: string;
        suburb: string;
        city: string;
        municipality: string;
        county: string;
        state: string;
        country: string;
        postcode: string;
        country_code: string;
    };
}

export enum StepsEnum {
    Start,
    Mapa,
    Info,
    Nahled,
    Potvrzeni,
}

export interface INovaJehla {
    lat: number | undefined;
    lng: number | undefined;
    info: string | undefined;
    datetime: number | undefined; // unix
    count: number | undefined;
    photo: string | undefined;
}

export interface IExistujiciJehla extends Omit<INovaJehla, 'count' | 'photo'>, Syringe {
    edit?: boolean;
    id: string;
}
export interface INovaJehlaError {
    count?: string;
}

export type JehlaState = INovaJehla | IExistujiciJehla;

export const isExistingSyringe = (variable: INovaJehla | IExistujiciJehla): variable is IExistujiciJehla => isObject(variable) && has(variable, 'id');
