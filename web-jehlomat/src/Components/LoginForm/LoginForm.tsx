import React, { useContext } from 'react';
import Box from '@mui/material/Box';
import TextInput from 'Components/Inputs/TextInput';

import { Form, Formik } from 'formik';
import { AxiosResponse } from 'axios';
import API from '../../config/baseURL';
import PrimaryButton from '../Buttons/PrimaryButton/PrimaryButton';
import * as yup from 'yup';
import { useHistory, useLocation } from 'react-router-dom';
import { ItemContainer } from './LoginForm.styles';
import { LINKS } from 'routes';
import { LoginContext } from 'utils/login';
import { ModalContext } from 'Components/Navigator/Navigator';
import { convertSearchParamsToMap } from 'utils/url';
import { isStatusGeneralSuccess, isStatusValidationError } from 'utils/payload-status';
import apiURL from 'utils/api-url';

interface LoginFormProps {}

interface IValues {
    email: string;
    password: string;
}

interface IResponse {
    token?: string;
    status?: string;
}

const validationSchema = yup.object({
    email: yup.string().email('Vlož validní email').required('Email je povinné pole'),
    password: yup.string().required('Heslo je povinné pole'),
});

export const LoginForm: React.FC<LoginFormProps> = () => {
    const history = useHistory();
    const { isModalVisible, closeModal } = useContext(ModalContext);
    const { setToken } = useContext(LoginContext);
    const { search } = useLocation();
    //const {setLogin} = useLogin();

    return (
        <>
            <Formik
                initialValues={{ email: '', password: '' }}
                validationSchema={validationSchema}
                onSubmit={async (values: IValues, { setErrors }) => {
                    try {
                        const login: IValues = {
                            email: values.email,
                            password: values.password,
                        };
                        const response: AxiosResponse<IResponse> = await API.post(apiURL.login, login);
                        const status = response.status;

                        switch (true) {
                            case isStatusGeneralSuccess(status): {
                                const token = response?.data?.token;
                                if (token) {
                                    setToken(token);
                                    if (isModalVisible) closeModal();
                                    const link = getRedirectionLink(search);
                                    history.push(link);
                                }
                                break;
                            }
                            case isStatusValidationError(status): {
                                //for validation error;
                                setErrors({ email: ' ', password: 'E-mail nebo heslo nejsou správne!' });
                                break;
                            }
                            default: {
                                //all others goes to error page; TODO push to error page
                                break;
                            }
                        }
                    } catch (error: any) {
                        //link to error page
                    }
                }}
            >
                {({ handleSubmit, touched, handleChange, handleBlur, values, errors, isValid }) => {
                    return (
                        <Form onSubmit={handleSubmit} style={{ width: '100%' }}>
                            <ItemContainer>
                                <TextInput
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.email}
                                    type="email"
                                    name="email"
                                    placeholder="E-mail"
                                    label="E-mail"
                                    required={true}
                                    error={touched.email && Boolean(errors.email) ? errors.email : undefined}
                                />
                            </ItemContainer>
                            <ItemContainer>
                                <TextInput
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.password}
                                    type="password"
                                    name="password"
                                    placeholder="Heslo"
                                    label="Heslo *"
                                    required={true}
                                    error={touched.password && Boolean(errors.password) ? errors.password : undefined}
                                />
                            </ItemContainer>
                            <Box justifyContent="center" sx={{ marginTop: '70px', display: 'flex' }}>
                                <PrimaryButton id="submit" text="PŘIHLÁSIT SE" type="submit" />
                            </Box>
                        </Form>
                    );
                }}
            </Formik>
        </>
    );
};

function getRedirectionLink(search: string, defaultLink = LINKS.WELCOME) {
    const searchMap = convertSearchParamsToMap(search);
    const fromLink = searchMap.get('from');
    return fromLink || defaultLink;
}

export default LoginForm;
