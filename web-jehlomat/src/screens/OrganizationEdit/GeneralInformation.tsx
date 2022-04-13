import { Box, Typography, useMediaQuery } from '@mui/material';
import { SContainer, STextInput } from '../RegistraceOrganizace/components/RegistrationForm.styled';
import * as yup from 'yup';
import PrimaryButton from 'Components/Buttons/PrimaryButton/PrimaryButton';
import SecondaryButton from 'Components/Buttons/SecondaryButton/SecondaryButton';
import { media } from 'utils/media';
import { IData, IOrgData } from 'screens/Organizace/use-organisation';
import { FC, useCallback, useContext, useMemo } from 'react';
import { Form, Formik } from 'formik';
import { AxiosResponse } from 'axios';
import API from 'config/baseURL';
import apiURL from 'utils/api-url';
import { ConfirmationModalContext } from 'context/confirmation-modal-context';
import { IUser } from 'types';

interface IProps {
    data: IData;
}

interface IValues {
    name: string;
    email: string;
}

const validationSchema = yup.object({
    name: yup.string().required('Název organizace je povinné pole'),
    email: yup.string().email('Vlož validní email').required('Email je povinné pole'),
});

const CONFIRMATION_MODAL_TITLE = 'Jste si jisti, že chcete upravit obecné informace o organizaci?';
const CONFIRMATION_MODAL_CONFIRM_BUTTON_TEXT = 'Ano';
const CONFIRMATION_MODAL_CANCEL_BUTTON_TEXT = 'Zrušit';

const confirmationModalParams = {
    title: CONFIRMATION_MODAL_TITLE,
    confirmText: CONFIRMATION_MODAL_CONFIRM_BUTTON_TEXT,
    cancelText: CONFIRMATION_MODAL_CANCEL_BUTTON_TEXT,
};

export const GeneralInformation: FC<IProps> = ({ data: { organisation, user } }) => {
    const isMobile = useMediaQuery(media.lte('mobile'));
    const confirmationModal = useContext(ConfirmationModalContext);

    const handleSubmit = useCallback(
        async (values: IValues, { setErrors }) => {
            const confirmResult = await (confirmationModal.current as any).show(confirmationModalParams);
            if (confirmResult === 'cancel') {
                return;
            }

            const newOrganisation = {
                ...organisation,
                name: values.name,
            };
            const response: AxiosResponse<IOrgData> = await API.put(apiURL.organization, newOrganisation);
            // TODO:
            // put email to user
            const newUser = {
                ...user,
                email: values.email,
            };
            const r: AxiosResponse<IUser> = await API.put(apiURL.user, newUser);
        },
        [organisation, confirmationModal, user],
    );

    const initialValues = useMemo(
        () => ({
            name: organisation.name,
            email: user.email,
        }),
        [organisation.name, user.email],
    );

    return (
        <SContainer>
            <Typography mb={4} variant="h6" textAlign="center">
                Obecná informace
            </Typography>
            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                {({ handleSubmit, touched, handleChange, handleBlur, values, errors, isValid }) => (
                    <Form onSubmit={handleSubmit}>
                        <Box display="flex" flexDirection="column" gap={2} mb={5}>
                            <STextInput
                                id="organizace"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.name}
                                type="text"
                                name="name"
                                placeholder="Název organizace *"
                                label="Název organizace *"
                                required={true}
                                error={touched.name && Boolean(errors.name) ? errors.name : undefined}
                            />
                            <STextInput
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.email}
                                type="email"
                                name="email"
                                placeholder="E-mail organizace *"
                                label="E-mail organizace *"
                                required={true}
                                error={touched.email && Boolean(errors.email) ? errors.email : undefined}
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
