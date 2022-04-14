import { Box, Typography, useMediaQuery } from '@mui/material';
import { SContainer, STextInput } from '../RegistraceOrganizace/components/RegistrationForm.styled';

import PrimaryButton from 'Components/Buttons/PrimaryButton/PrimaryButton';
import SecondaryButton from 'Components/Buttons/SecondaryButton/SecondaryButton';
import { media } from 'utils/media';
import { Form, Formik } from 'formik';
import { FC, useCallback, useState } from 'react';
import * as yup from 'yup';
import { PASSWORD_COMPLEXITY } from 'utils/constants';
import { useConfirmationModalContext } from 'context/confirmation-modal-context';
import { AxiosResponse } from 'axios';
import API from 'config/baseURL';
import { IData } from 'screens/Organizace/use-organisation';
import apiURL from 'utils/api-url';
import { isStatusSuccess } from 'utils/payload-status';

interface IProps {
    data: IData;
}

interface IValues {
    oldPassword: string;
    newPassword: string;
    passwordConfirm: string;
}

const CONFIRMATION_MODAL_TITLE = 'Jste si jisti, že chcete upravit heslo?';
const CONFIRMATION_MODAL_CONFIRM_BUTTON_TEXT = 'Ano';
const CONFIRMATION_MODAL_CANCEL_BUTTON_TEXT = 'Zrušit';

const confirmationModalParams = {
    title: CONFIRMATION_MODAL_TITLE,
    confirmText: CONFIRMATION_MODAL_CONFIRM_BUTTON_TEXT,
    cancelText: CONFIRMATION_MODAL_CANCEL_BUTTON_TEXT,
};

const initialValues: IValues = {
    oldPassword: '',
    newPassword: '',
    passwordConfirm: '',
};

const validationSchema = yup.object({
    oldPassword: yup.string().required('Staré heslo je povinné pole'),
    newPassword: yup.string().matches(PASSWORD_COMPLEXITY, 'Heslo musí obsahovat číslo, velké a malé písmeno').min(8, 'Heslo musí být 8 znaků dlouhé').required('Heslo je povinné pole'),
    passwordConfirm: yup.string().oneOf([yup.ref('newPassword'), null], 'Hesla musí být stejná'),
});

export const Password: FC<IProps> = ({ data: { user } }) => {
    const isMobile = useMediaQuery(media.lte('mobile'));
    const confirmationModal = useConfirmationModalContext();
    const [requestError, setRequestError] = useState('');

    const handleSubmit = useCallback(
        async (values: IValues, { resetForm }) => {
            setRequestError("");
            const confirmResult = await confirmationModal?.show(confirmationModalParams);
            if (!confirmResult || confirmResult === 'cancel') {
                return;
            }

            const passwordBody = {
                oldPassword: values.oldPassword,
                newPassword: values.newPassword,
            };
            const response: AxiosResponse<string> = await API.put(apiURL.getUserPassword(user.id), passwordBody);
            if (!isStatusSuccess(response.status)) {
                return setRequestError(response.data)
            }
            resetForm();
        },
        [confirmationModal, user],
    );

    return (
        <SContainer>
            <Typography mb={4} mt={[6, 0]} variant="h6" textAlign="center">
                Změna hesla
            </Typography>
            <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={validationSchema}>
                {({ handleSubmit, touched, handleChange, handleBlur, values, errors, isValid }) => (
                    <Form onSubmit={handleSubmit}>
                        <Box display="flex" flexDirection="column" gap={2} mb={5}>
                            <STextInput
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.oldPassword}
                                type="password"
                                name="oldPassword"
                                placeholder="Staré heslo"
                                label="Staré heslo *"
                                required={true}
                                error={touched.oldPassword && Boolean(errors.oldPassword) ? errors.oldPassword : undefined}
                            />
                            <STextInput
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.newPassword}
                                type="password"
                                name="newPassword"
                                placeholder="Nové heslo"
                                label="Nové heslo *"
                                required={true}
                                error={touched.newPassword && Boolean(errors.newPassword) ? errors.newPassword : undefined}
                            />
                            <STextInput
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.passwordConfirm}
                                type="password"
                                name="passwordConfirm"
                                placeholder="Heslo"
                                label="Potvrzeni hesla *"
                                required={true}
                                error={touched.passwordConfirm && Boolean(errors.passwordConfirm) ? errors.passwordConfirm : undefined}
                            />
                        </Box>

                        {requestError ? (
                            <Box marginBottom={2}>
                                <Typography color="#D32F2F" align="center" variant="body2">
                                    {requestError}
                                </Typography>
                            </Box>
                        ) : null}

                        <Box display="flex" flexDirection="column" alignItems="center">
                            {isMobile ? <PrimaryButton id="submit" text="Uložit" type="submit" disabled={!isValid} /> : <SecondaryButton id="submit" text="Uložit" type="submit" disabled={!isValid} />}
                        </Box>
                    </Form>
                )}
            </Formik>
        </SContainer>
    );
};
