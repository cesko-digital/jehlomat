import { FC, useContext } from 'react';
import { Redirect, Route, useLocation } from 'react-router';
import { LoginContext } from 'utils/login';

const PrivateRoute: FC<any> = (props) => {

    const location = useLocation();
    const { token } = useContext(LoginContext);
    console.log("authLogin", token);
  
    return token ? (
      <Route {...props} />
    ) : (
      <Redirect
        to={{
          pathname: "/login",
          state: { from: location }
        }}
      />
    );
  };

  export default PrivateRoute;