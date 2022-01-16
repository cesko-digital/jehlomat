import { useMutation } from "react-query"
import API from "config/baseURL"

export function useSyringeState() {
  return useMutation((values: { kod: string }) => {
    return API.post("/api/v1/jehlomat/syringe-state", values)
  })
}
