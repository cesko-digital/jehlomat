import { useMutation } from "react-query"
import API from "config/baseURL"

export type OrganizationRequestBody = {
  name: string
  email: string
  password: string
}

export function useCreateOrganization() {
  return useMutation((organization: OrganizationRequestBody) => {
    return API.post("/api/v1/jehlomat/organization/", organization)
  })
}
