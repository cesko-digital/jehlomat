import axios from 'axios';
const API_V1 = "/api/v1/jehlomat"
const HOST = process.env.REACT_APP_SERVER ?? "localhost";
const PORT = process.env.REACT_APP_SERVER_PORT ?? 8082;
const BASE_URL = `${HOST}:${PORT}${API_V1}`;

const fetchClient = () => {
    const defaultOptions = {
        baseURL: BASE_URL,
        headers: {
            'Content-Type': 'application/json',
        },
    };

    let instance = axios.create(defaultOptions)

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

export const authorizedAPI = (jwt: string) => {
    const client = fetchClient();
    //const token = localStorage.getItem("auth");
    client.defaults.headers.common['Authorization'] = jwt ? `Bearer ${jwt}` : '';

    return client;
};
