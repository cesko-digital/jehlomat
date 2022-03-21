class APIURL {
    login = '/login';
    organization = '/organization';
    userVerification = '/verification/user';
    user = '/user';

    getSyringe(syringeId: string) {
        return `/syringe/${syringeId}`;
    }

    getOrganizationVerification(orgId: string) {
        return `/verification/organization?orgId=${orgId}`;
    }

    getUser(userId: string) {
        return `${this.user}/${userId}`;
    }
}

const apiURL = new APIURL();

export default apiURL;
