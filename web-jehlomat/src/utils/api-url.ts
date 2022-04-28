class APIURL {
    login = '/login';
    organization = '/organization';
    userVerification = '/verification/user';
    user = '/user';

    getUserPassword(userId: string | number) {
        return `${this.user}/${userId}/password`;
    }

    getUserAttributes(userId: string | number) {
        return `${this.user}/${userId}/attributes`;
    }

    getSyringe(syringeId: string) {
        return `/syringe/${syringeId}`;
    }

    getOrganizationVerification(orgId: string) {
        return `/verification/organization?orgId=${orgId}`;
    }

    getUser(userId: string | number) {
        return `${this.user}/${userId}`;
    }

    getUsersInOrganization(orgId: string | number) {
        return `${this.organization}/${orgId}/users`;
    }

    getOrganization(orgId?: string | number) {
        return `${this.organization}/${orgId}`;
    }

    readSyringeDetails(id: string) {
        return `/syringle/${id}`;
    }
}

const apiURL = new APIURL();

export default apiURL;
