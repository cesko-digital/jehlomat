import { FormikHelpers } from 'formik';
import { AxiosResponse } from 'axios';
import API from 'config/baseURL';
import hasOwnProperty from 'utils/hasOwnProperty';
import { useHistory } from 'react-router-dom';
import { useEffect, useMemo } from 'react';
import apiURL from 'utils/api-url';
import { isStatusGeneralSuccess } from 'utils/payload-status';
import { useConfirmationModalContext } from 'context/confirmation-modal-context';
import { texts } from '../SetNewPassword.texts';

export interface SetPasswordFormProps {
    password: string;
    rePassword: string;
}

const useSetNewPassword = () => {
    const confirmationModal = useConfirmationModalContext();
    const history = useHistory();

    const params = useMemo(() => {
        const parts = document.location.hash.substring(1).split('?');
        const query = parts[Math.max(0, parts.length - 1)];
        const params = new URLSearchParams(query);

        return {
            userId: params.get('userId'),
            code: params.get('code'),
        };
    }, []);

    useEffect(() => {
        const { userId, code } = params;
        if (!userId || !code) {
            confirmationModal!
                .show({
                    title: texts.MODAL__MISSING_PARAMETERS__TEXT,
                    confirmText: 'Ok',
                })
                .then(() => history.push('/'));

            return;
        }

        API.post(apiURL.testResetPassword, { userId, code }).then(resp => {
            if (isStatusGeneralSuccess(resp.status)) return;

            confirmationModal!
                .show({
                    title: texts.MODAL__UNABLE_VERIFY__TEXT,
                    confirmText: 'Ok',
                })
                .then(() => history.push('/'));
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleFormSubmit = async (values: SetPasswordFormProps, { setErrors }: FormikHelpers<SetPasswordFormProps>) => {
        try {
            const { password } = values;
            const { userId, code } = params;
            const response: AxiosResponse = await API.post(apiURL.setNewPassword, { userId, code, password });
            const isSuccess = isStatusGeneralSuccess(response.status);

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
