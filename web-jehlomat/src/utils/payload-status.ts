type TStatus = number;
export const isStatusGeneralSuccess = (status: TStatus) => /2[0-9][0-9]/g.test(status.toString());

export const isStatusSuccess = (status: TStatus) => status === 200;

export const isStatusConflictError = (status: TStatus) => status === 409;

export const isStatusNotFound = (status: TStatus) => status === 404;

export const isStatusNoPermission = (status: TStatus) => status === 403;

export const isStatusUnauthorized = (status: TStatus) => status === 401;

export const isStatusNoContent = (status: TStatus) => status === 204;
