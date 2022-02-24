import { FC, useContext, useEffect } from 'react';
import { authorizedAPI } from 'config/baseURL';
import { LoginContext } from 'utils/login';

interface Props { }

const Organizace: FC<Props> = () => {
    //const [org, setOrg] = useState();
    const { token } = useContext(LoginContext);
    useEffect(() => {
        async function fetchMyAPI() {
            if (token) {
                const data = await authorizedAPI(token).get(`/api/v1/jehlomat/organization/${1}`);
                console.log({ data });
                if (data) {
                    // setOrg(data);
                }
            }
        }
        fetchMyAPI();
    });

    return <>Organizace</>;
};

export default Organizace;
