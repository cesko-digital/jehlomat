type TStatus = number | string

export const isStatusGeneralSuccess = (status: TStatus) =>
  /2[0-9][0-9]/g.test(status.toString())

export const isStatusSuccess = (status: TStatus) =>
  status.toString() === "200"

export const isStatusValidationError = (status: TStatus) =>
  status.toString() === "409"

export const isStatusNotFound = (status: TStatus) =>
  status.toString() === "404"

export const isStatusNoPermission = (status: TStatus) =>
  status.toString() === "403"

export const isStatusNoContent = (status: TStatus) =>
  status.toString() === "204"