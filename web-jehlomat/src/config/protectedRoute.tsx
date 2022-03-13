import { FC, useContext } from 'react';
import { Redirect, Route, useLocation } from 'react-router';
import { LOGIN_URL_PATH } from 'routes';
import { LoginContext } from 'utils/login';
import { convertSearchParamsToString } from 'utils/url';

interface IRedirectSearchParams {
  // specifies redirection URL after successfull login
  from?: string
}

const PrivateRoute: FC<any> = ({ from, ...rest }) => {
    const location = useLocation();
    const { token } = useContext(LoginContext);
    
    const searchParams: IRedirectSearchParams = {}
    if (from) {
      searchParams.from = location.pathname
    }

    const search = convertSearchParamsToString(searchParams as Record<string, string>);
    console.log("authLogin", token);
  
    return token ? (
      <Route {...rest} />
    ) : (
      <Redirect
        to={{
          pathname: `/${LOGIN_URL_PATH}`,
          state: { from: location },
          search
        }}
      />
    );
  };

  export default  PrivateRoute;