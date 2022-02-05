import React from 'react';
import Box from '@mui/material/Box';
import TextInput from 'Components/Inputs/TextInput';

import { Form, Formik } from 'formik';
import { AxiosResponse } from 'axios';
import API from '../../config/baseURL';
import PrimaryButton from '../Buttons/PrimaryButton/PrimaryButton';
import * as yup from 'yup';
import { useHistory } from 'react-router-dom';
import { ItemContainer } from './LoginForm.styles';
import { LINKS } from 'utils/links';
import { setToken } from 'utils/login';

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

export const LoginForm: React.FC<LoginFormProps> = props => {
    const history = useHistory();

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
                        const response: AxiosResponse<IResponse> = await API.post('/api/v1/jehlomat/login', login);
                        const status = response.status;

                        switch (true) {
                            case /2[0-9][0-9]/g.test(status.toString()): {
                                const token = response?.data?.token;
                                if (token) {
                                    setToken(token);
                                    history.push(LINKS.welcome);
                                }
                                break;
                            }
                            case status === 401: {
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

export default LoginForm;
