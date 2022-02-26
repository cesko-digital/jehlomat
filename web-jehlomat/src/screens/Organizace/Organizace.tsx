<<<<<<< HEAD
import { FC, useEffect } from 'react';
//import { authorizedAPI } from 'config/baseURL';
//import { LoginContext } from 'utils/login';
=======
import { FC, useContext, useEffect } from 'react';
import { authorizedAPI } from 'config/baseURL';
import { LoginContext } from 'utils/login';
>>>>>>> 8c6cb25 (Token to context and refreshing context when page reloaded)

interface Props { }

const Organizace: FC<Props> = () => {
    //const [org, setOrg] = useState();
<<<<<<< HEAD
    //const { token } = useContext(LoginContext);
    useEffect(() => {
        /*async function fetchMyAPI() {
=======
    const { token } = useContext(LoginContext);
    useEffect(() => {
        async function fetchMyAPI() {
>>>>>>> 8c6cb25 (Token to context and refreshing context when page reloaded)
            if (token) {
                const data = await authorizedAPI(token).get(`/api/v1/jehlomat/organization/${1}`);
                console.log({ data });
                if (data) {
                    // setOrg(data);
                }
            }
        }*/
        //fetchMyAPI();
    });

    return <h1>ORG</h1>;
};

export default Organizace;
