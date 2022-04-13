import { AxiosResponse } from 'axios';
import API from 'config/baseURL';
import { useCallback } from 'react';
import { IUser } from 'types';
import apiURL from 'utils/api-url';
import { isStatusNotFound, isStatusSuccess } from 'utils/payload-status';

export type TErrorCallback = (type: 'error' | 'not-found') => void;
export interface IOrgData {
  verified: boolean;
  id: number;
  name: string;
}

export interface IData {
  user: IUser,
  organisation: IOrgData
}

type IUsersData = IUser[];

export const useOrganisation = (onError?: TErrorCallback) => {
    return useCallback(async (orgId?: string) => {
        const orgResponse: AxiosResponse<IOrgData> = await API.get(apiURL.getOrganization(orgId));
        if (isStatusSuccess(orgResponse.status)) {
            const usersResponse: AxiosResponse<IUsersData> = await API.get(apiURL.getUsersInOrganization(orgResponse.data.id));
            const admin = usersResponse.data.find(({ isAdmin }) => isAdmin);
            if (admin) {
                return {
                  organisation: orgResponse.data,
                  user: {
                    ...admin,
                    email: 'magda@gmail.com' // TODO: remove hardcode
                  }
                };
            } else {
              onError?.("error");
            }
        } else if (isStatusNotFound(orgResponse.status)) {
          onError?.("not-found");
        } else {
          onError?.("error");
        }
    }, [onError]);
};
