import axios from 'axios';

const fetchClient = () => {
  const defaultOptions = {
    baseURL: `${process.env.REACT_APP_SERVER}:${process.env.REACT_APP_SERVER_PORT}`,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  let instance = axios.create(defaultOptions);

  //instance.interceptors.request.use(function (config) {
    //const token = localStorage.getItem('token');
    //config.headers.Authorization =  token ? `Bearer ${token}` : '';
    //return config;
  //});

  instance.interceptors.response.use(function (response) {
    return response;
  }, function (error) {
    //Error from server resolve as normal response
    return Promise.resolve(error.response);
  });

  return instance;
};

export default fetchClient();