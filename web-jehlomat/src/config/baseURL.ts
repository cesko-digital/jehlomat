import axios from 'axios';
import { getToken } from 'utils/login';

const fetchClient = () => {
    const defaultOptions = {
        baseURL: `${process.env.REACT_APP_SERVER}:${process.env.REACT_APP_SERVER_PORT}`,
        headers: {
            'Content-Type': 'application/json',
        },
    };

    let instance = axios.create(defaultOptions);

    instance.interceptors.response.use(
        function (response) {
            return response;
        },
        function (error) {
            //Error from server resolve as normal response
            return Promise.resolve(error.response);
        },
    );

    return instance;
};

export default fetchClient();

const authorizedAPIfnc = () => {
    const client = fetchClient();
    const token = getToken();

    client.defaults.headers.common['Authorization'] = token ? `Bearer ${token}` : '';
    console.log(client.defaults.headers);

    return client;
};

export const authorizedAPI = authorizedAPIfnc();
