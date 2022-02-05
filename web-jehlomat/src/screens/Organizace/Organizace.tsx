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
        fetchMyAPI();
    });

    return <div>Organizace</div>;
};

export default Organizace;
