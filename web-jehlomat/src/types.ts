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
    verified: boolean;
    organizationId: number;
    teamId: number;
    isAdmin: boolean;
}

export interface IUserEdited {
    id?: number;
    email: string;
    username: string;
    verified?: boolean;
    organizationId?: number;
    teamId: number;
    isAdmin?: boolean;
}

