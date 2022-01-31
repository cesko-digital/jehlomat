import { FC, useEffect, useState } from 'react';
import PrimaryButton from '../../Components/Buttons/PrimaryButton/PrimaryButton';
import TextButton from '../../Components/Buttons/TextButton/TextButton';
import Grid from '@mui/material/Grid';
import { useTheme } from '@mui/material/styles';
import TitleBar from '../../Components/Navigation/TitleBar';
import * as yup from 'yup';

import { useHistory } from 'react-router-dom';
import { Form, Formik } from 'formik';
import TextInput from '../../Components/Inputs/TextInput/TextInput';
import API from '../../config/baseURL';
import { AxiosResponse } from 'axios';
import { Container, useMediaQuery } from '@mui/material';
import { primary, white, secondary } from '../../utils/colors';
import { ChevronLeft } from '@mui/icons-material';

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

const Login: FC<any> = () => {

    let history = useHistory();
    const theme = useTheme();
    const desktop = useMediaQuery(theme.breakpoints.up('sm'));


    return (
        <Container sx={{ height: '100vh', width: '100%' }}>
            <Grid container justifyContent="start" sx={{ height: '100%', width: '100%' }}>
                <TitleBar icon={<ChevronLeft sx={{ color: white, fontSize: 40 }} />} onIconClick={() => { history.goBack() }}></TitleBar>
                <Grid container direction="column" sx={{ height: '100%', width: '100%' }} justifyContent="start" alignItems="center">
                    <Formik
                        initialValues={{ email: '', password: '' }}
                        validationSchema={validationSchema}
                        onSubmit={async (values: IValues, { setErrors }) => {
                            try {
                                const login: IValues = {
                                    email: values.email,
                                    password: values.password,
                                }
                                const response: AxiosResponse<IResponse> = await API.post("/api/v1/jehlomat/login/", login);
                                const status = response.status;

                                switch (true) {
                                    case /2[0-9][0-9]/g.test(status.toString()): {
                                        const token = response?.data?.token
                                        if(token) {
                                            localStorage.setItem("auth", token)
                                        };
                                        break;
                                    }
                                    case status === 401: {
                                        //for validation error; 
                                        setErrors({ email: " ", password: "E-mail nebo heslo nejsou správne!" })
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
                                <Form onSubmit={handleSubmit}>
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
                                    <PrimaryButton id="submit" text="PŘIHLÁSIT SE" type="submit" />
                                </Form>
                            );
                        }}
                    </Formik>
                </Grid>
            </Grid>
        </Container>
    );
}

export default Login;
