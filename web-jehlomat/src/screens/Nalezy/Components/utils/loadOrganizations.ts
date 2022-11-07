import { AxiosResponse } from 'axios';
import { API } from 'config/baseURL';
import { IOrganizace } from 'types';

const loadOrganizations = async () => {
    const url = `/organization`;
    const organizations: AxiosResponse<Array<IOrganizace>> = await API.get(url);
    if (organizations.status !== 200) throw new Error('Unable to load data');

    return organizations.data;
};

export default loadOrganizations;
