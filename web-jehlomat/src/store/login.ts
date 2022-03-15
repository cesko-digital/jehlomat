import { atom, selector } from 'recoil';
import { recoilPersist } from 'recoil-persist';
import jwt_decode from 'jwt-decode';
import { IToken } from 'types';
import dayjs, { Dayjs } from 'dayjs';

const { persistAtom } = recoilPersist();

export const tokenState = atom<string | undefined>({
    key: 'tokenState',
    default: undefined,
    effects_UNSTABLE: [persistAtom],
});

export const tokenExpirationState = selector<Dayjs | undefined>({
    key: 'tokenExpiration',
    get: ({ get }) => {
        const token = get(tokenState);
        if(!token) return undefined;

        const decoded: IToken = jwt_decode(token);
        return dayjs.unix(decoded.exp);
    },
});

export const userIDState = selector<number | undefined>({
    key: 'userID',
    get: ({ get }) => {
        const token = get(tokenState);
        if(!token) return undefined;

        const decoded: IToken = jwt_decode(token);

        return decoded["user-id"];
    },
});

export const isLoginValidState = selector<boolean>({
    key: 'isLoginValid',
    get: ({ get }) => {
        const token = get(tokenState);
        if(!token) return false;

        const expiration = get(tokenExpirationState);
        if(!expiration) return false;

        return expiration > dayjs();
    },
});
