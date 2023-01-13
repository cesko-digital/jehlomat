class APIURL {
    login = '/login';
    organization = '/organization';
    userVerification = '/verification/user';
    user = '/user';
    team = '/team';
    setNewPassword = '/password-reset/save';
    testResetPassword = '/password-reset/test-code';
    sendResetPassword = '/password-reset/send-code';

    getUserPassword(userId: string | number) {
        return `${this.user}/${userId}/password`;
    }

    getUserAttributes(userId: string | number) {
        return `${this.user}/${userId}/attributes`;
    }

    getSyringe(syringeId: string) {
        return `/syringe/${syringeId}`;
    }

    getSyringeInfo(syringeId: string) {
        return `/syringe/${syringeId}/info`;
    }

    getOrganizationList() {
        return this.organization;
    }

    getOrganizationVerification(orgId: string) {
        return `/verification/organization?orgId=${orgId}`;
    }

    postAdminOrganizationVerification() {
        return `/verification/org-admin`;
    }

    getUser(userId: string | number) {
        return `${this.user}/${userId}`;
    }

    getCurrentUser() {
        return `${this.user}`;
    }

    getUsersInOrganization(orgId: string | number) {
        return `${this.organization}/${orgId}/users`;
    }

    getOrganization(orgId?: string | number) {
        return `${this.organization}/${orgId}`;
    }

    readSyringeDetails(id: string) {
        return `/syringe/${id}`;
    }

    getTeamsInOrganization(orgId?: string | number) {
        return `${this.organization}/${orgId}/teams`;
    }

    putUser(userId: string | number) {
        return `${this.user}/${userId}/attributes`;
    }

    deleteUserFromOrganization(userId: string | number) {
        return `${this.user}/${userId}`;
    }

    deleteOrGetTeamFromOrganization(teamId: string | number) {
        return `${this.team}/${teamId}`;
    }
}

const apiURL = new APIURL();

export default apiURL;
