class APIURL {
  login = "/login"
  organization = "/organization"
  userVerification = "/verification/user"
  user = "/user"

  getSyringe(syringeId: string) {
    return `/syringe/${syringeId}`;
  }

  getOrganizationVerification(orgId: string) {
    return `/verification/organization?orgId=${orgId}`;
  }

  getUser(userId: string | number) {
    return `${this.user}/${userId}`
  }

  getUsersInOrganization(orgId: string | number) {
    return `${this.organization}/${orgId}/users`
  }

  getOrganization(orgId?: string | number) {
    return `${this.organization}/${orgId}`;
  }
}

const apiURL = new APIURL();

export default apiURL;