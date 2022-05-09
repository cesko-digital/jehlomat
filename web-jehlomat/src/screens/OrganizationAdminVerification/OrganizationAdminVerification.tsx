
import PrimaryButton from "Components/Buttons/PrimaryButton/PrimaryButton";
import { useHistory } from "react-router";
import { LINKS } from "routes";
import OrganizationVerification from "screens/OrganizationVerification/OrganizationVerification";
import { useQuery } from "utils/location";

const OrganizationAdminVerification = () => {
    const query = useQuery();
    const code = query && query.get('code') ? query.get('code')! : '';
    const user = query && query.get('userId') ? query.get('userId')! : '';
    const history = useHistory();

    return (
        <OrganizationVerification code={code} userId={user}>
            <PrimaryButton onClick={() => {
                history.push(LINKS.LOGIN);
            }} text={'Přejít na příhlášení'} />
        </OrganizationVerification>
    );
};



export default OrganizationAdminVerification;
