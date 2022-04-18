import jwt_decode from "jwt-decode";
import { AxiosResponse } from 'axios';
import {API} from './baseURL';

interface IToken {
    "aud": string;
    "user-id": string;
    "iss": string;
    "exp": string;
}

interface IResponse {
    id: number;
    email?: string;
    username: string;
    password?: string;
    organizationId: number;
    teamId: number;
    isAdmin?: boolean;
    verified?: boolean;
}

export const getMe = (token: string) => {
    const decoded: IToken = jwt_decode(token);
    return decoded["user-id"];
}
export const getUser = async (token: string) => {
    const response: AxiosResponse<IResponse> = await API.get("/user/" + getMe(token));
    return response.data;
}

