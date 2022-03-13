import { FC, useContext } from 'react';
import Box from '@mui/material/Box';
import { Redirect, Route, useLocation } from 'react-router';
import { LoginContext } from 'utils/login';

const PrivateRoute: FC<any> = (props) => {

    const location = useLocation();
    const { token } = useContext(LoginContext);


    return token ? (
        <Box py={8}>
            <Route {...props} />
        </Box>
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
