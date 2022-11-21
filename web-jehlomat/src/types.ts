export interface WithModal {
    inModal?: boolean;
}

export interface IToken {
    aud: string;
    'user-id': number;
    iss: string;
    exp: number; // unix
}

export interface IUser {
    id: number;
    email: string;
    username: string;
    organizationId: number;
    teamId: number | undefined;
    isAdmin: boolean;
    verified?: boolean;
    isSuperAdmin?: boolean;
}

export interface IUserEdited {
    id?: number;
    email: string;
    username: string;
    verified?: boolean;
    organizationId?: number;
    teamId: number | string | undefined;
    isAdmin?: boolean;
}

type Location = {
    id: number;
    mestkaCast: string | null;
    mestkaCastName: string | null;
    obec: string | null;
    obecName: string | null;
    okres: string | null;
    okresName: string | null;
};
export interface ITeam {
    id: number;
    name: string;
    organizationId: number;
    locations: Location[];
}

export interface IOrganizace {
    id: number;
    name: string;
    verified: boolean;
}

export enum SyringeStatus {
    CekaNaLikvitaci = 'Čeká na likvidaci',
    Rezervovan = 'Rezervováno',
    Zlikvidovan = 'Zlikvidováno',
}

export interface ILocation {
    id: string;
    type: string;
    name?: string;
}
