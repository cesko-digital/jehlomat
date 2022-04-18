import { AxiosResponse } from 'axios';
import { API } from 'config/baseURL';

export interface User {
    id: number;
    username: string;
}

const loadUsers = async (organizationId: number) => {
    const url = `/organization/${organizationId}/users`;
    const users: AxiosResponse<Array<User>> = await API.get(url);
    if (users.status !== 200) throw new Error('Unable to load data');

    return users.data;
};

export default loadUsers;
