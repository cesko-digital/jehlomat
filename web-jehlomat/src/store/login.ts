import { atom, selector } from 'recoil';
import { recoilPersist } from 'recoil-persist';
import jwt_decode from 'jwt-decode';
import { IToken } from 'types';
import dayjs, { Dayjs } from 'dayjs';

const { persistAtom } = recoilPersist();

export const tokenState = atom<string | null>({
    key: 'tokenState',
    default: null,
    effects_UNSTABLE: [persistAtom],
});

export const tokenExpirationState = selector<Dayjs | null>({
    key: 'tokenExpiration',
    get: ({ get }) => {
        const token = get(tokenState);
        if (!token) return null;

        const decoded: IToken = jwt_decode(token);
        return dayjs.unix(decoded.exp);
    },
});

export const userIDState = selector<number | null>({
    key: 'userID',
    get: ({ get }) => {
        const token = get(tokenState);
        if (!token) return null;

        const decoded: IToken = jwt_decode(token);

        return decoded['user-id'];
    },
});

export const isLoginValidState = selector<boolean>({
    key: 'isLoginValid',
    get: ({ get }) => {
        const token = get(tokenState);
        if (!token) return false;

        const expiration = get(tokenExpirationState);
        if (!expiration) return false;

        return expiration > dayjs();
    },
});
