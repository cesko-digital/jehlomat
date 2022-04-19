import { FormikHelpers } from 'formik';
import { AxiosResponse } from 'axios';
import API from 'config/baseURL';
import hasOwnProperty from 'utils/hasOwnProperty';
import { useHistory } from 'react-router-dom';
import { useEffect } from 'react';
import apiURL from '../../../utils/api-url';

export interface SetPasswordFormProps {
    password: string;
    rePassword: string;
}

const useSetNewPassword = () => {
    const history = useHistory();

    useEffect(() => {}, []);

    const handleFormSubmit = async (values: SetPasswordFormProps, { setErrors }: FormikHelpers<SetPasswordFormProps>) => {
        try {
            const response: AxiosResponse = await API.post(apiURL.setNewPassword, values);

            const status = response.status;
            const isSuccess = status >= 200 && status < 300;

            if (isSuccess) {
                history.push('/');
                return;
            }

            if (response.data && typeof response.data === 'object' && hasOwnProperty(response.data, 'fieldName') && hasOwnProperty(response.data, 'status')) {
                const fieldName = response.data.fieldName as string;
                setErrors({
                    [fieldName]: response.data.status,
                });

                return;
            }

            history.push('/');
        } catch (error: unknown) {
            console.warn('Unable to set a new password', error);

            history.push('/error');
        }
    };

    return {
        handleFormSubmit,
    };
};

export default useSetNewPassword;
