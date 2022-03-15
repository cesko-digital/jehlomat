import { IUser as IPerson } from 'types';

export interface IListSyringe {
    syringeList: ISyringe[];
    pageInfo: {
        index: number;
        size: number;
        hasMore: boolean;
    };
}

export interface ILocation {
    id: number;
    okres: string;
    obec: number;
    mestkaCast: number;
}

export interface ISyringe {
    id: string;
    createdAt: number;
    createdBy: IPerson;
    reservedTill?: number;
    reservedBy?: IPerson;
    demolishedAt?: number;
    demolishedBy?: IPerson;
    photo?: string;
    count: number;
    note: string;
    demolisher: string;
    gps_coordinates: string;
    demolished: boolean;
    location: ILocation;
}

export const syringeMock: IListSyringe = {
    syringeList: [
        {
            id: 'R4YFD1AC',
            createdAt: 1637092279,
            createdBy: {
                id: 0,
                email: 'peter@raavn.net',
                username: 'Peter124',
                verified: false,
                organizationId: 1,
                teamId: 1,
                isAdmin: true,
            },
            reservedTill: 1637092279,
            reservedBy: {
                id: 0,
                email: 'peter@raavn.net',
                username: 'Peter124',
                verified: false,
                organizationId: 1,
                teamId: 1,
                isAdmin: true,
            },
            gps_coordinates: '25.326,-31.265',
            demolished: false,
            demolishedAt: 1639092279,
            demolishedBy: {
                id: 0,
                email: 'peter@raavn.net',
                username: 'Peter123',
                verified: false,
                organizationId: 0,
                teamId: 0,
                isAdmin: true,
            },
            count: 1,
            note: 'note 1',
            demolisher: 'NO',
            location: {
                id: 0,
                okres: 'CZ0323',
                obec: 554791,
                mestkaCast: 546003,
            },
        },
        {
            id: 'DMGID1AC',
            createdAt: 1637092279,
            createdBy: {
                id: 0,
                email: 'peter@raavn.net',
                username: 'Peter124',
                verified: false,
                organizationId: 1,
                teamId: 1,
                isAdmin: true,
            },
            reservedTill: 1637092279,
            reservedBy: {
                id: 0,
                email: 'peter@raavn.net',
                username: 'Peter124',
                verified: false,
                organizationId: 1,
                teamId: 1,
                isAdmin: true,
            },
            gps_coordinates: '25.326,-31.265',
            demolished: true,
            demolishedAt: 1639092279,
            demolishedBy: {
                id: 0,
                email: 'peter@raavn.net',
                username: 'Peter123',
                verified: false,
                organizationId: 0,
                teamId: 0,
                isAdmin: true,
            },
            count: 1,
            note: 'note 1',
            demolisher: 'NO',
            location: {
                id: 0,
                okres: 'CZ0323',
                obec: 554791,
                mestkaCast: 546003,
            },
        },
        {
            id: 'R4YFD1F2',
            createdAt: 1637092279,
            createdBy: {
                id: 0,
                email: 'peter@raavn.net',
                username: 'Peter124',
                verified: false,
                organizationId: 1,
                teamId: 1,
                isAdmin: true,
            },
            gps_coordinates: '25.326,-31.265',
            demolished: false,
            count: 1,
            note: 'note 1',
            demolisher: 'NO',
            location: {
                id: 0,
                okres: 'CZ0323',
                obec: 554791,
                mestkaCast: 546003,
            },
        },
    ],
    pageInfo: {
        index: 0,
        size: 20,
        hasMore: false,
    },
};
