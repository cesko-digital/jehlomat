import { FC, useEffect } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { tokenState, userIDState } from 'store/login';
import { userState } from 'store/user';
import { useHistory } from 'react-router-dom';
import { IUser } from 'types';
import { AxiosResponse } from 'axios';
import { API, setApiToken } from 'config/baseURL';
import { LINKS } from 'routes';
import apiURL from 'utils/api-url';

export const SetLogin: FC = () => {
    const token = useRecoilValue(tokenState);
    const setUser = useSetRecoilState(userState);
    const userId = useRecoilValue(userIDState);
    const history = useHistory();

    useEffect(() => {
        if (token && userId) {
            // set token to authorized instance
            setApiToken(token);

            const getUser = async (token: string) => {
                const response: AxiosResponse<IUser> = await API.get(apiURL.getUser(userId));
                return response.data;
            };

            // fetch user and save to store
            getUser()
                .then(user => {
                    setUser(user);
                })
                .catch(() => {
                    history.push(LINKS.ERROR);
                });
        }
        // disable because of history var, should be handled better tho
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token, userId, setUser]);

    return null;
};
