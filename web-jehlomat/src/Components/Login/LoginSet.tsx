import { FC, useEffect } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { tokenState, userIDState } from 'store/login';
import { userState } from 'store/user';
import { IUser } from 'types';
import { AxiosResponse } from 'axios';
import { authorizedAPI, setAuthorizedApiToken } from 'config/baseURL';

export const LoginSet: FC = () => {
    const token = useRecoilValue(tokenState);
    const setUser = useSetRecoilState(userState);
    const userId = useRecoilValue(userIDState);

    useEffect(() => {
        if (token && userId) {
            // set token to authorized instance
            setAuthorizedApiToken(token);

            const getUser = async (token: string) => {
                const response: AxiosResponse<IUser> = await authorizedAPI.get('/api/v1/jehlomat/user/' + userId);
                return response.data;
            };

            // fetch user and save to store
            getUser(token)
                .then(user => {
                    setUser(user);
                })
                .catch(error => {
                    console.log(error); //should goes to the error page
                });
        }
    }, [token, userId, setUser]);

    return null;
};
