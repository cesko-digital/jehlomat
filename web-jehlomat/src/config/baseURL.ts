import axios from 'axios';

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

<<<<<<< HEAD
export const authorizedAPI = (jwt: string) => {
    const client = fetchClient();
    //const token = localStorage.getItem("auth");
    client.defaults.headers.common['Authorization'] = jwt ? `Bearer ${jwt}` : '';

    return client;
};
=======
export const authorizedAPI = (jwt:string) => {
    const client = fetchClient();
    const token = localStorage.getItem("auth");
    client.defaults.headers.common['Authorization'] = jwt ? `Bearer ${jwt}` : '';

    return client;
};
>>>>>>> 8c6cb25 (Token to context and refreshing context when page reloaded)
