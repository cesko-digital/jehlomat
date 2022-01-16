import { useMutation } from "react-query"
import API from "config/baseURL"

export type UserRequestBody = {
  email: string | null
  username: string
  password: string
  code: string | null
}

export function useUserVerification() {
  return useMutation((user: UserRequestBody) => {
    return API.post("/api/v1/jehlomat/verification/user", user)
  })
}
