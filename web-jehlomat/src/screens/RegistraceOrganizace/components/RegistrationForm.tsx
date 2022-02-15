import { Formik, Form } from 'formik';
import * as yup from 'yup';
import { useHistory } from 'react-router-dom';
import { authorizedAPI } from '../../../config/baseURL';
import { AxiosResponse } from 'axios';
import { SContainer, STextInput, SBackLink } from './RegistrationForm.styled';
import { Box, Typography, useMediaQuery } from '@mui/material';
import SecondaryButton from 'Components/Buttons/SecondaryButton/SecondaryButton';
import { LINKS } from 'utils/links';
import { media } from 'utils/media';
import PrimaryButton from 'Components/Buttons/PrimaryButton/PrimaryButton';
import useLocalStorage from 'hooks/useLocalStorage';

interface IValues {
    organizace: string;
    email: string;
    heslo: string;
    hesloConfirm: string;
}

interface IOrganization {
    name: string;
    email: string;
    password: string;
}

const validationSchema = yup.object({
    organizace: yup.string().required('Název organizace je povinné pole'),
    email: yup.string().email('Vlož validní email').required('Email je povinné pole'),
    heslo: yup
        .string()
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/, 'Heslo musí obsahovat číslo, velké a malé písmeno')
        .min(8, 'Heslo musí být 8 znaků dlouhé')
        .required('Heslo je povinné pole'),
    hesloConfirm: yup.string().oneOf([yup.ref('heslo'), null], 'Hesla musí být stejná'),
});

export default function RegistrationForm() {
    const history = useHistory();
    const [, setValue] = useLocalStorage('organizationEmail', '');

    const isMobile = useMediaQuery(media.lte('mobile'));

    return (
        <SContainer>
            <Typography display={['none', 'flex']} mb={4} variant="h6" textAlign="center">
                Založení účtu organizace
            </Typography>
            <Formik
                initialValues={{ organizace: '', email: '', heslo: '', hesloConfirm: '' }}
                validationSchema={validationSchema}
                onSubmit={async (values: IValues, { setErrors }) => {
                    try {
                        const organizace: IOrganization = {
                            name: values.organizace,
                            email: values.email,
                            password: values.heslo,
                        };

                        const response: AxiosResponse<any> = await authorizedAPI.post('/api/v1/jehlomat/organization', organizace);
                        const status = response.status;

                        switch (true) {
                            case /2[0-9][0-9]/g.test(status.toString()): {
                                setValue(values.email);
                                //for all success response;
                                history.push('/organizace/validace', { email: values.email });
                                break;
                            }
                            case status === 409: {
                                //for validation error;
                                const fieldName = response.data.fieldName;
                                setErrors({ [fieldName]: response.data.status });
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
                            <Box display="flex" flexDirection="column" gap={2} mb={5}>
                                <STextInput
                                    id="organizace"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.organizace}
                                    type="text"
                                    name="organizace"
                                    placeholder="Název organizace *"
                                    label="Název organizace *"
                                    required={true}
                                    error={touched.organizace && Boolean(errors.organizace) ? errors.organizace : undefined}
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
                                <STextInput
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.heslo}
                                    type="password"
                                    name="heslo"
                                    placeholder="Heslo"
                                    label="Heslo *"
                                    required={true}
                                    error={touched.heslo && Boolean(errors.heslo) ? errors.heslo : undefined}
                                />
                                <STextInput
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.hesloConfirm}
                                    type="password"
                                    name="hesloConfirm"
                                    placeholder="Heslo"
                                    label="Potvrzeni hesla *"
                                    required={true}
                                    error={touched.hesloConfirm && Boolean(errors.hesloConfirm) ? errors.hesloConfirm : undefined}
                                />
                            </Box>

                            <Box display="flex" flexDirection="column" alignItems="center">
                                {isMobile ? (
                                    <PrimaryButton id="submit" text="Registrovat" type="submit" disabled={!isValid} />
                                ) : (
                                    <SecondaryButton id="submit" text="Založit" type="submit" disabled={!isValid} />
                                )}

                                <SBackLink to={LINKS.home}>Zrušit</SBackLink>
                            </Box>
                        </Form>
                    );
                }}
            </Formik>
        </SContainer>
    );
}
