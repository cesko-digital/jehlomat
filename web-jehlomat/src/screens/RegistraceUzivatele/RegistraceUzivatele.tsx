import { FC } from 'react';
import { Formik, Form, FormikHelpers } from 'formik';
import TextInput from '../../Components/Inputs/TextInput/TextInput';
import { FormHeading } from '../../utils/typography';
import { useHistory } from 'react-router-dom';
import PrimaryButton from '../../Components/Buttons/PrimaryButton/PrimaryButton';
import { AxiosResponse } from 'axios';
import * as yup from 'yup';
import API from '../../config/baseURL';
import { Header } from '../../Components/Header/Header';
import { useQuery } from '../../utils/location';
import { isStatusGeneralSuccess, isStatusValidationError } from 'utils/payload-status';
import apiURL from 'utils/api-url';
import {PASSWORD_COMPLEXITY} from 'utils/constants';

interface Props {}

interface IValues {
    email: string;
    heslo: string;
    jmeno: string;
    hesloConfirm: string;
}

interface IUserRequest {
    email: string | null;
    username: string;
    password: string;
    code: string | null;
}

const validationSchema = yup.object({
    jmeno: yup.string().required('Jméno je povinné pole'),
    email: yup.string().email('Vlož validní email').required('Email je povinné pole'),
    heslo: yup
        .string()
        .matches(PASSWORD_COMPLEXITY, 'Heslo musí obsahovat číslo, velké a malé písmeno')
        .min(8, 'Heslo musí být 8 znaků dlouhé')
        .required('Heslo je povinné pole'),
    hesloConfirm: yup.string().oneOf([yup.ref('heslo'), null], 'Hesla musí být stejná'),
});

const RegistraceUzivatele: FC<Props> = () => {
    const history = useHistory();
    const query = useQuery();
    const email = query && query.get('email') ? query.get('email')! : '';

    return (
        <>
            <Header mobileTitle="Nový uživatel" />

            <FormHeading>Pracovnik Organizace </FormHeading>
            <Formik
                initialValues={{ email: email, heslo: '', hesloConfirm: '', jmeno: '' }}
                validationSchema={validationSchema}
                onSubmit={async (values: IValues, { setErrors }: FormikHelpers<IValues>) => {
                    try {
                        const user: IUserRequest = {
                            email: query.get('email'),
                            password: values.heslo,
                            username: values.jmeno,
                            code: query.get('code'),
                        };
                        const response: AxiosResponse<any> = await API.post(apiURL.userVerification, user);
                        const status = response.status;

                        switch (true) {
                            case isStatusGeneralSuccess(status): {
                                //for all success response;
                                history.push('/uzivatel/dekujeme');
                                break;
                            }
                            case isStatusValidationError(status): {
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
                            <TextInput
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.email}
                                disabled={true}
                                type="text"
                                name="email"
                                placeholder="Email"
                                label="E-mail pracovníka*"
                                required={true}
                                error={touched.email && Boolean(errors.email) ? errors.email : undefined}
                            />
                            <TextInput
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.jmeno}
                                type="text"
                                name="jmeno"
                                placeholder="jméno"
                                label="Uživatelské jméno*"
                                required={true}
                                error={touched.jmeno && Boolean(errors.jmeno) ? errors.jmeno : undefined}
                            />
                            <TextInput
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.heslo}
                                type="password"
                                name="heslo"
                                placeholder="heslo"
                                label="Heslo*"
                                required={true}
                                error={touched.heslo && Boolean(errors.heslo) ? errors.heslo : undefined}
                            />
                            <TextInput
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.hesloConfirm}
                                type="password"
                                name="hesloConfirm"
                                placeholder="heslo"
                                label="Potvrzení hesla*"
                                required={true}
                                error={touched.hesloConfirm && Boolean(errors.hesloConfirm) ? errors.hesloConfirm : undefined}
                            />
                            <PrimaryButton id="submit" text="DOKONČIT" type="submit" disabled={!isValid} />
                        </Form>
                    );
                }}
            </Formik>
        </>
    );
};

export default RegistraceUzivatele;
