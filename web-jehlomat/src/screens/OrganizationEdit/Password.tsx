import { Box, Typography, useMediaQuery } from '@mui/material';
import { SContainer, STextInput } from '../RegistraceOrganizace/components/RegistrationForm.styled';

import PrimaryButton from 'Components/Buttons/PrimaryButton/PrimaryButton';
import SecondaryButton from 'Components/Buttons/SecondaryButton/SecondaryButton';
import { media } from 'utils/media';
import { Form, Formik } from 'formik';
import { FC, useCallback, useContext } from 'react';
import * as yup from 'yup';
import { PASSWORD_COMPLEXITY } from 'utils/constants';
import { ConfirmationModalContext } from 'context/confirmation-modal-context';
import { AxiosResponse } from 'axios';
import API from 'config/baseURL';
import { IData } from 'screens/Organizace/use-organisation';
import apiURL from 'utils/api-url';
import { IUser } from 'types';

interface IProps {
    data: IData;
}

interface IValues {
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
    newPassword: '',
    passwordConfirm: '',
};

const validationSchema = yup.object({
    newPassword: yup.string().matches(PASSWORD_COMPLEXITY, 'Heslo musí obsahovat číslo, velké a malé písmeno').min(8, 'Heslo musí být 8 znaků dlouhé').required('Heslo je povinné pole'),
    passwordConfirm: yup.string().oneOf([yup.ref('newPassword'), null], 'Hesla musí být stejná'),
});

export const Password: FC<IProps> = ({ data: { user } }) => {
    const isMobile = useMediaQuery(media.lte('mobile'));
    const confirmationModal = useContext(ConfirmationModalContext);

    const handleSubmit = useCallback(
        async (values: IValues) => {
            const confirmResult = await (confirmationModal.current as any).show(confirmationModalParams);
            if (confirmResult === 'cancel') {
                return;
            }

            const newUser = {
                ...user,
                password: values.newPassword,
            };
            const response: AxiosResponse<IUser> = await API.put(apiURL.user, newUser);
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

                        <Box display="flex" flexDirection="column" alignItems="center">
                            {isMobile ? <PrimaryButton id="submit" text="Uložit" type="submit" disabled={!isValid} /> : <SecondaryButton id="submit" text="Uložit" type="submit" disabled={!isValid} />}
                        </Box>
                    </Form>
                )}
            </Formik>
        </SContainer>
    );
};
