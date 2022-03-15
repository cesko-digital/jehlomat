import { atom } from 'recoil';
import { IUser } from 'types';

export const userState = atom<IUser | undefined>({
    key: 'loginState',
    default: undefined,
});
