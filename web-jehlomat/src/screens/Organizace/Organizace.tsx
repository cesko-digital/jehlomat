import { FC, useEffect } from 'react';
import { authorizedAPI } from 'config/baseURL';

interface Props {}

const Organizace: FC<Props> = () => {
    //const [org, setOrg] = useState();

    useEffect(() => {
        async function fetchMyAPI() {
            const data = await authorizedAPI.get(`/api/v1/jehlomat/organization/${1}`);

            console.log({ data });
            if (data) {
                // setOrg(data);
            }
        }
        //fetchMyAPI();
    });

    return <h1>ORG</h1>;
};

export default Organizace;
