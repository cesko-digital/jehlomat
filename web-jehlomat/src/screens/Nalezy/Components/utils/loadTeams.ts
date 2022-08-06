import { AxiosResponse } from 'axios';
import { API } from 'config/baseURL';

export interface Team {
    id: number;
    name: string;
}

const loadTeams = async (organizationId: number) => {
    const url = `/organization/${organizationId}/teams`;
    const users: AxiosResponse<Array<Team>> = await API.get(url);
    if (users.status !== 200) throw new Error('Unable to load data');

    return users.data;
};

export default loadTeams;
